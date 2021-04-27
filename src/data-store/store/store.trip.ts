import { makeAutoObservable, runInAction } from "mobx";
import { IJoinedTrip, ITripCreateData, ServiceTrip } from "../../service/service.trip";
import { AppDataStore } from "../app.store";

export class StoreTrip {

    private _creatingTrip = false;
    private _joiningTrip = false;
    private _checkingJoinedTrip = true;
    private _joinedTrip: IJoinedTrip | null = null;

    constructor(private rootStore: AppDataStore, private serviceTrip: ServiceTrip) {
        makeAutoObservable(this);
    }

    public get creatingTrip() { return this._creatingTrip; }
    public get joiningTrip() { return this._joiningTrip; }
    public get joinedTrip() { return this._joinedTrip; }
    public get checkingJoinedTrip() { return this._checkingJoinedTrip; }
    public get hasOngoingTrip() { return !this._checkingJoinedTrip && !!this._joinedTrip; }

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
    }

    public doCleanup = () => {
        //
    }
}