import { makeAutoObservable } from "mobx";
import { ServiceTracker } from "../../service/service.tracker";
import { AppDataStore } from "../app.store";

export class StoreHome {

    public loading = false;

    constructor(private rootStore: AppDataStore, private serviceTracker: ServiceTracker) {
        makeAutoObservable(this);
    }
}