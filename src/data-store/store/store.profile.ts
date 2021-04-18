import { makeAutoObservable } from "mobx";
import { ServiceUser } from "../../service/service.user";
import { AppDataStore } from "../app.store";

export class StoreProfile {

    constructor(private rootStore: AppDataStore, private serviceUser:ServiceUser) {
        makeAutoObservable(this);
    }

    public get loggingOut() {
        return this.rootStore.storeAuth.loggingOut;
    }
    public get user() {
        return this.rootStore.storeAuth.user;
    }

    public logout = () => {
        this.rootStore.storeAuth.logout();
    }
}