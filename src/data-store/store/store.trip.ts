import { makeAutoObservable, runInAction } from "mobx";
import { PNUnsubscribe } from "../../service/service.pubnub";
import { IJoinedTrip, ITripCreateData, ServiceTrip, TripStatus } from "../../service/service.trip";
import { PublisherChannel } from "../../utils/constants";
import { toaster } from "../../utils/toaster";
import { AppDataStore } from "../app.store";
import Parse from 'parse/react-native';
import { snackbar } from "../../utils/snackbar";

interface ITripJoinLiveData {
    joined: number,
    remaining: number,
    status: TripStatus,
    joinedBy: string
}
interface ITripStatusLiveData {
    id: string,
    tripId: string,
    updatedAt: string,
    lastStatus: TripStatus,
    newStatus: TripStatus
}
export interface IOngoingTripData {
    id: string,
    tripId: string,
    destination: string,
    description: string,
    name: string,
    status: TripStatus,
    maxMember: number,
    createdAt: string,
    endAt: string,
    isHost: boolean,
    members: {
        name: string,
        photo: string,
    }[]
}

export class StoreTrip {

    private _creatingTrip = false;
    private _joiningTrip = false;
    private _startingTrip = false;
    private _finishingTrip = false;
    private _cancellingingTrip = false;
    private _updatingLocation = false;
    private _gettingTrips = false;
    private _checkingJoinedTrip = true;
    private _joinedTrip: IJoinedTrip | null = null;
    private _unsubscribeJoined!: PNUnsubscribe | null;
    private _unsubscribeStarted!: PNUnsubscribe | null;
    private _unsubscribeFinished!: PNUnsubscribe | null;
    private _unsubscribeCancelled!: PNUnsubscribe | null;

    constructor(private rootStore: AppDataStore, private serviceTrip: ServiceTrip) {
        makeAutoObservable(this);
    }

    public get creatingTrip() { return this._creatingTrip; }
    public get joiningTrip() { return this._joiningTrip; }
    public get startingTrip() { return this._startingTrip; }
    public get finishingTrip() { return this._finishingTrip; }
    public get cancellingTrip() { return this._cancellingingTrip; }
    public get gettingTrips() { return this._gettingTrips; }
    public get updatingLocation() { return this._updatingLocation; }
    public get joinedTrip() { return this._joinedTrip; }
    public get checkingJoinedTrip() { return this._checkingJoinedTrip; }
    public get hasOngoingTrip() { return !this._checkingJoinedTrip && !!this._joinedTrip; }

    private _onNewUserJoined = (data: ITripJoinLiveData) => {
        toaster.show({
            message: `${data.joinedBy} joined the trip.`,
            gravity: 'CENTER'
        });
        runInAction(() => {
            if (this._joinedTrip) {
                this._joinedTrip = {
                    ...this._joinedTrip,
                    joined: data.joined,
                    remaining: data.remaining,
                    status: data.status
                };
            }
        });
    }
    private _onTripStarted = (data: ITripStatusLiveData) => {
        toaster.show({ message: "trip started", gravity: 'CENTER' });
        // now unsubscribe for these listeners
        this._unsubscribeJoined?.();
        this._unsubscribeStarted?.();
        // update status
        runInAction(() => {
            if (this._joinedTrip) {
                this._joinedTrip = {
                    ...this._joinedTrip,
                    status: data.newStatus
                };
            }
        });
    }
    private _onTripFinished = (data: ITripStatusLiveData) => {
        toaster.show({ message: "trip finished", gravity: 'CENTER' });
        this._unsubscribeAll();
        runInAction(() => {
            this._joinedTrip = null;
        });
        this.rootStore.noTripNow();
    }
    private _onTripCancelled = (data: ITripStatusLiveData) => {
        toaster.show({ message: "trip cancelled", gravity: 'CENTER' });
        this._unsubscribeAll();
        runInAction(() => {
            this._joinedTrip = null;
        });
        this.rootStore.noTripNow();
    }

    private _subscribeToChannels = (result: IJoinedTrip) => {
        const tripId = result.tripId;
        if ([TripStatus.PLANNED, TripStatus.STARTED].includes(result.status)
            && result.remaining > 0) {
            const channelJoined = PublisherChannel.tripJoined(tripId);
            this._unsubscribeJoined = this.rootStore.servicePubnub.subscribe(channelJoined,
                this._onNewUserJoined);
        }
        if (!result.isHost) {
            const channelCancelled = PublisherChannel.tripCancelled(tripId);
            const channelFinished = PublisherChannel.tripFinished(tripId);
            const channelStarted = PublisherChannel.tripStarted(tripId);
            this._unsubscribeCancelled = this.rootStore.servicePubnub.subscribe(channelCancelled,
                this._onTripCancelled);
            this._unsubscribeFinished = this.rootStore.servicePubnub.subscribe(channelFinished,
                this._onTripFinished);
            this._unsubscribeStarted = this.rootStore.servicePubnub.subscribe(channelStarted,
                this._onTripStarted);
        }
    }

    public createTrip = async (data: ITripCreateData) => {
        runInAction(() => { this._creatingTrip = true; });
        const result = await this.serviceTrip.createTrip(data);
        runInAction(() => {
            this._creatingTrip = false;
        });
        return result;
    }

    public joinNewTrip = async (tripId: string) => {
        runInAction(() => { this._joiningTrip = true; });
        const result = await this.serviceTrip.joinTrip(tripId);
        runInAction(() => {
            this._joiningTrip = false;
            this._checkingJoinedTrip = false;
            this._joinedTrip = result;
        });
        if (result)
            this._subscribeToChannels(result);
    }

    public checkForJoinedTrip = async () => {
        runInAction(() => { this._checkingJoinedTrip = true });
        const result = await this.serviceTrip.getOngoingTrip();
        runInAction(() => {
            this._joiningTrip = false;
            this._checkingJoinedTrip = false;
            this._joinedTrip = result;
        });
        // subscribe for trip listeners
        if (result)
            this._subscribeToChannels(result);
    }

    public startTrip = async () => {
        try {
            runInAction(() => { this._startingTrip = true });
            const result = <ITripStatusLiveData>await Parse.Cloud.run("trip-start");
            runInAction(() => {
                this._startingTrip = false;
                if (this._joinedTrip) {
                    this._joinedTrip = {
                        ...this._joinedTrip,
                        status: result.newStatus,
                    }
                }
            });
            return true;
        } catch (err) {
            runInAction(() => { this._startingTrip = false });
            snackbar.show({
                message: err.message,
                type: 'error'
            });
            return false;
        }
    }

    public finishTrip = async () => {
        try {
            runInAction(() => { this._finishingTrip = true; });
            const result = <ITripStatusLiveData>await Parse.Cloud.run("trip-finish");
            this._unsubscribeAll();
            runInAction(() => {
                this._finishingTrip = false;
                this._joinedTrip = null;
            });
            return true;
        } catch (err) {
            runInAction(() => { this._finishingTrip = false; });
            snackbar.show({
                message: err.message,
                type: 'error'
            });
            return false;
        }
    }

    public cancelTrip = async () => {
        try {
            runInAction(() => { this._cancellingingTrip = true });
            const result = <ITripStatusLiveData>await Parse.Cloud.run("trip-cancel");
            this._unsubscribeAll();
            runInAction(() => {
                this._cancellingingTrip = false;
                this._joinedTrip = null;
            });
            return true;
        } catch (err) {
            runInAction(() => { this._cancellingingTrip = false; });
            snackbar.show({
                message: err.message,
                type: 'error'
            });
            return false;
        }
    }

    public updateCurrentLocation = async () => {
        runInAction(() => { this._updatingLocation = true });
    }

    public getTrips = async (status: TripStatus) => {
        runInAction(() => { this._gettingTrips = true });
    }

    // cancel any subscription.
    public doCleanup = () => {
        this._unsubscribeAll();
        this.serviceTrip.doCleanup();
    }

    private _unsubscribeAll = () => {
        this._unsubscribeJoined?.();
        this._unsubscribeStarted?.();
        this._unsubscribeCancelled?.();
        this._unsubscribeFinished?.();
    }
}