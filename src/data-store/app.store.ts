import { API } from "../service/api";
import { ServiceAuth } from "../service/service.auth";
import { ServiceLocation } from "../service/service.location";
import { ServiceTracker } from "../service/service.tracker";
import { ServiceTrip } from "../service/service.trip";
import { ServiceUser } from "../service/service.user";
import { StoreAuth } from "./store/store.auth";
import { StoreHome } from "./store/store.home";
import { StoreLocation } from "./store/store.location";
import { StoreProfile } from "./store/store.profile";
import { StoreTrip } from "./store/store.trip";

export class AppDataStore {
    private _storeAuth: StoreAuth | null = null;
    private _storeHome: StoreHome | null = null;
    private _storeProfile: StoreProfile | null = null;
    private _storeTrip: StoreTrip | null = null;
    private _storeLocation: StoreLocation | null = null;

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
    public get storeLocation() {
        if (!this._storeLocation)
            this._storeLocation = new StoreLocation(this, new ServiceLocation(API.getInstance()));
        return this._storeLocation;
    }

    // Call this method "Only After Successfull Logout"
    // Do not set undefined || null to _storeAuth & don't perform any clean-up on that also.
    public doLogoutCleanup = () => {
        // perform clean-up task for each store
        this._storeHome?.doCleanup();
        this._storeProfile?.doCleanup();
        this._storeTrip?.doCleanup();
        this._storeLocation?.doCleanup();
        // set each store for garbedge collection
        this._storeHome = null;
        this._storeProfile = null;
        this._storeTrip = null;
        this._storeLocation = null;
    }
}