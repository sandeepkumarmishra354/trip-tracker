import { API } from "../service/api";
import { ServiceAuth } from "../service/service.auth";
import { ServiceTracker } from "../service/service.tracker";
import { ServiceTrip } from "../service/service.trip";
import { ServiceUser } from "../service/service.user";
import { StoreAuth } from "./store/store.auth";
import { StoreHome } from "./store/store.home";
import { StoreProfile } from "./store/store.profile";
import { StoreTrip } from "./store/store.trip";

export class AppDataStore {
    private _storeAuth?: StoreAuth;
    private _storeHome?: StoreHome;
    private _storeProfile?: StoreProfile;
    private _storeTrip?: StoreTrip;

    public get storeAuth() {
        if (!this._storeAuth)
            this._storeAuth = new StoreAuth(new ServiceAuth(API.getInstance()), this.doLogoutCleanup);
        return this._storeAuth;
    }
    public get storeHome() {
        if (!this._storeHome)
            this._storeHome = new StoreHome(this, new ServiceTracker(API.getInstance()));
        return this._storeHome;
    }
    public get storeProfile() {
        if (!this._storeProfile)
            this._storeProfile = new StoreProfile(this, new ServiceUser(API.getInstance()));
        return this._storeProfile;
    }
    public get storeTrip() {
        if (!this._storeTrip)
            this._storeTrip = new StoreTrip(this, new ServiceTrip(API.getInstance()));
        return this._storeTrip;
    }

    //call this method "Only After Successfull Logout"
    public doLogoutCleanup = () => {
        this._storeHome = undefined;
        this._storeProfile = undefined;
        this._storeTrip = undefined;
    }
}