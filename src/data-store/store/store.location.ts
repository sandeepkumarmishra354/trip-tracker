import { makeAutoObservable, runInAction } from "mobx";
import { MyLocation, ServiceLocation } from "../../service/service.location";
import { PNUnsubscribe } from "../../service/service.pubnub";
import { PublisherChannel } from "../../utils/constants";
import { toaster } from "../../utils/toaster";
import { AppDataStore } from "../app.store";
import Parse from 'parse/react-native';

export interface ILiveLocationData {
    tripId: string,
    latitude: number,
    longitude: number,
    timestamp: number,
    user: {
        name: string,
        photo: string,
        email: string
    }
}

export class StoreLocation {

    private _unsubscribeLiveUpdate: PNUnsubscribe | null = null;
    private _myCurrentLocation: MyLocation | null = null;
    private _membersLocation: ILiveLocationData[] = [];
    private readonly _userEmail;

    constructor(private rootStore: AppDataStore, private serviceLocation: ServiceLocation) {
        makeAutoObservable(this);
        this._userEmail = rootStore.storeAuth.parseUser?.getEmail() ?? "";
    }

    public get myCurrentLocation() { return this._myCurrentLocation; }
    public get membersLocation() { return this._membersLocation; }

    private _onLiveLocationUpdate = (data: ILiveLocationData) => {
        console.log(data);
        if (data.user.email !== this._userEmail) {
            toaster.show({
                message: `location update: ${data.user.name}`,
                gravity: 'CENTER'
            });
            const foundAt = this._membersLocation.findIndex((value) => {
                return value.user.email === data.user.email;
            });
            if (foundAt === -1) {
                runInAction(() => {
                    this._membersLocation = [...this._membersLocation, data];
                });
            } else {
                runInAction(() => {
                    this._membersLocation[foundAt] = data;
                    this._membersLocation = [...this._membersLocation];
                });
            }
        }
    }

    private _subscribeToLiveUpdate = () => {
        if (!this._unsubscribeLiveUpdate) {
            const tripId = this.rootStore.storeTrip.joinedTrip?.tripId;
            if (tripId) {
                const channel = PublisherChannel.tripLocationUpdate(tripId);
                this._unsubscribeLiveUpdate = this.rootStore.servicePubnub
                    .subscribe(channel, this._onLiveLocationUpdate);
            }
        }
    }

    private _onLocationChange = (location: MyLocation) => {
        runInAction(() => {
            this._myCurrentLocation = location;
        });
        // save location to the database.
    }
    // query for all members location
    private _fetchMembersLocation = () => {
        Parse.Cloud.run("trip-members-location")
            .then(res => {
                runInAction(() => {
                    this._membersLocation = res;
                });
            })
            .catch(err => {
                toaster.show({ message: err.message, gravity: 'CENTER' });
            });
    }

    public initiate = async () => {
        this._fetchMembersLocation();
        const configured = await this.serviceLocation.configure(this._onLocationChange);
        if (configured) {
            const status = await this.serviceLocation.start();
            if (status)
                this._subscribeToLiveUpdate();
            return status;
        }
        return false;
    }

    // cancel any subscription.
    public doCleanup = () => {
        this._unsubscribeLiveUpdate?.();
        this.serviceLocation.doCleanup();
    }
}