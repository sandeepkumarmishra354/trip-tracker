import { makeAutoObservable, runInAction } from "mobx";
import { ServiceUser } from "../../service/service.user";
import { AppDataStore } from "../app.store";
import Parse from 'parse/react-native';
import { snackbar } from "../../utils/snackbar";
import { IUserProfile } from "../../data-type/type.data";
import { serviceStorage } from "../../service/service.storage";

export class StoreProfile {

    private _profileData!: IUserProfile;
    private _fetching = true;

    constructor(private rootStore: AppDataStore, private serviceUser: ServiceUser) {
        makeAutoObservable(this);
    }

    private _setFetching = (status: boolean) => {
        runInAction(() => {
            this._fetching = status;
        });
    }

    public get fetching() { return this._fetching; }
    public get profileData() { return this._profileData; }

    public get loggingOut() {
        return this.rootStore.storeAuth.loggingOut;
    }

    public logout = () => {
        this.rootStore.storeAuth.logout();
    }

    public fetchProfile = async () => {
        if (!this._profileData) {
            try {
                this._setFetching(true);
                let profile = await serviceStorage.getUserProfile();
                if (!profile) {
                    profile = await Parse.Cloud.run("profile") as IUserProfile;
                    profile = await serviceStorage.saveUserProfile(profile);
                }
                runInAction(() => {
                    this._profileData = profile!!;
                    this._fetching = false;
                });
            } catch (err) {
                snackbar.show({
                    message: err.message,
                    type: 'error'
                });
                this._setFetching(false);
            }
        }
    }

    // cancel any subscription.
    public doCleanup = () => {
        this.serviceUser.doCleanup();
    }
}