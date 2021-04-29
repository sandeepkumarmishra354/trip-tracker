import { makeAutoObservable, runInAction } from "mobx";
import { PNUnsubscribe, servicePubnub } from "../../service/service.pubnub";
import { IJoinedTrip, ITripCreateData, ServiceTrip, TripStatus } from "../../service/service.trip";
import { PublisherChannel } from "../../utils/constants";
import { toaster } from "../../utils/toaster";
import { AppDataStore } from "../app.store";

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
    private _pnUnsubscribers: PNUnsubscribe[] = [];

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

    private _addUnsubscriber = (un: PNUnsubscribe | null) => {
        if (un)
            this._pnUnsubscribers.push(un);
    }

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
        //
    }
    private _onTripFinished = (data: ITripStatusLiveData) => {
        //
    }
    private _onTripCancelled = (data: ITripStatusLiveData) => {
        //
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
        if (result) {
            const channelJoined = PublisherChannel.tripJoined(result.tripId);
            const channelCancelled = PublisherChannel.tripCancelled(result.tripId);
            const channelFinished = PublisherChannel.tripFinished(result.tripId);
            const channelStarted = PublisherChannel.tripStarted(result.tripId);
            const un1 = servicePubnub.subscribe(channelJoined, this._onNewUserJoined);
            const un2 = servicePubnub.subscribe(channelCancelled, this._onTripCancelled);
            const un3 = servicePubnub.subscribe(channelFinished, this._onTripFinished);
            const un4 = servicePubnub.subscribe(channelStarted, this._onTripStarted);
            this._addUnsubscriber(un1);
            this._addUnsubscriber(un2);
            this._addUnsubscriber(un3);
            this._addUnsubscriber(un4);
        }
    }

    public startTrip = async () => {
        runInAction(() => { this._startingTrip = true });
    }

    public finishTrip = async () => {
        runInAction(() => { this._finishingTrip = true });
    }

    public cancelTrip = async () => {
        runInAction(() => { this._cancellingingTrip = true });
    }

    public updateCurrentLocation = async () => {
        runInAction(() => { this._updatingLocation = true });
    }

    public getTrips = async (status: TripStatus) => {
        runInAction(() => { this._gettingTrips = true });
    }

    // cancel any subscription.
    public doCleanup = () => {
        this._pnUnsubscribers.forEach(un => un());
        this.serviceTrip.doCleanup();
    }
}