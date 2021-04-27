import { makeAutoObservable } from "mobx";
import { ServiceLocation } from "../../service/service.location";
import { AppDataStore } from "../app.store";

export class StoreLocation {

    public loading = false;

    constructor(private rootStore: AppDataStore, private serviceLocation: ServiceLocation) {
        makeAutoObservable(this);
    }

    public doCleanup = () => {
        //
    }
}