import { makeAutoObservable } from "mobx";
import { ServiceLocation } from "../../service/service.location";
import { AppDataStore } from "../app.store";

interface ILiveLocationData {
    tripId: string,
    latitude: number,
    longitude: number,
    user: {
        name: string,
        photo: string,
        email: string,
        isHost: boolean
    }
}

export class StoreLocation {

    public loading = false;

    constructor(private rootStore: AppDataStore, private serviceLocation: ServiceLocation) {
        makeAutoObservable(this);
    }

    // cancel any subscription.
    public doCleanup = () => {
        this.serviceLocation.doCleanup();
    }
}