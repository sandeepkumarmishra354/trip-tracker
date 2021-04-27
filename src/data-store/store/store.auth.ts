import { makeAutoObservable, runInAction } from "mobx";
import { ServiceAuth } from "../../service/service.auth";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import Parse from 'parse/react-native';
import { LoginMethod } from "../../data-type/type.data";

export class StoreAuth {
    public authenticated = false;
    public loggingOut = false;
    public showPhoneAuth = false;
    public otpSent = false;
    public sendingOtp = false;
    public verifyingOtp = false;
    public initiating = true;
    public loginVia: LoginMethod | 'none' = 'none';
    public user: FirebaseAuthTypes.User | null = null;
    public parseUser: Parse.User | null = null;

    public get authenticating() {
        return this.loginVia !== 'none';
    }
    public get sendingVerifyingOtp() {
        return this.sendingOtp || this.verifyingOtp;
    }

    constructor(private serviceAuth: ServiceAuth, private cleanup: () => void) {
        makeAutoObservable(this);
        this.init();
    }

    public init = async () => {
        if(!this.user || !this.parseUser) {
            const user = auth().currentUser;
            const parseUser = await Parse.User.currentAsync();
            runInAction(() => {
                this.user = user;
                this.parseUser = parseUser;
                this.authenticated = !!this.user && !!this.parseUser;
                this.initiating = false;
            });
        }
    }

    public setShowPhoneAuth = (show: boolean) => {
        runInAction(() => {
            this.showPhoneAuth = show;
            if (!show) {
                this.loginVia = 'none';
                this.otpSent = false;
            }
        });
    }

    public login = async (method: LoginMethod) => {
        runInAction(() => { this.loginVia = method; });
        if (method !== 'phone') {
            const user = await this.serviceAuth.loginWith(method);
            runInAction(() => {
                this.loginVia = 'none';
                this.authenticated = !!user;
                this.user = user;
            });
        } else {
            this.setShowPhoneAuth(true);
        }
    }

    public sendOtp = async (phoneNumber: string) => {
        runInAction(() => {
            this.sendingOtp = true;
            this.verifyingOtp = false;
            this.otpSent = false;
        });
        const success = await this.serviceAuth.sendOtp(phoneNumber);
        runInAction(() => {
            this.sendingOtp = false;
            this.verifyingOtp = false;
            this.otpSent = success;
        });
    }
    public verifyOtp = async (otp: string) => {
        runInAction(() => {
            this.verifyingOtp = true;
            this.sendingOtp = false;
        });
        const user = await this.serviceAuth.verifyOtp(otp);
        runInAction(() => {
            this.loginVia = 'none';
            this.verifyingOtp = false;
            this.sendingOtp = false;
            this.authenticated = user ? true : false;
            this.otpSent = user ? false : true;
            this.showPhoneAuth = user ? false : true;
            this.user = user;
        });
    }

    public logout = async () => {
        runInAction(() => { this.loggingOut = true });
        const success = await this.serviceAuth.logout();
        runInAction(() => {
            this.loggingOut = false
            if (success) {
                this.authenticated = false;
                this.user = null;
                this.parseUser = null;
            }
        });
        if (success)
            this.cleanup();
    }
}