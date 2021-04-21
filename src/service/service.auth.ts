import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { API } from "./api"
import { serviceStorage } from './service.storage';
import { Constants } from '../utils/constants';
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { toaster } from '../utils/toaster';
import { helperParse, IParseAuthOption } from './helper/helper.parse';

//call this method before using any sign in method (google,facebook,phone)
GoogleSignin.configure({
    webClientId: Constants.webClientId,
});

export type LoginMethod = 'google' | 'facebook' | 'phone';

export class ServiceAuth {

    private phoneAuthConfirmation?: FirebaseAuthTypes.ConfirmationResult;

    constructor(private api: API) { }

    private _getParseDetails = (user: FirebaseAuthTypes.User, method: LoginMethod): IParseAuthOption => {
        return {
            username: user.email ?? "",
            email: user.email ?? "",
            fullname: user.displayName ?? "",
            method,
            photo: user.photoURL ?? "",
            token: user.uid,
        };
    }

    private _loginWithGoogle = async () => {
        try {
            //check if google play service is installed on device
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { user, idToken } = await GoogleSignin.signIn();
            const gc = auth.GoogleAuthProvider.credential(idToken, user.id);
            const data = await auth().signInWithCredential(gc);
            const parseUser = await helperParse.checkAndSignup(this._getParseDetails(data.user, 'google'));
            if (!parseUser) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                throw new Error("parse server login/signup fail...");
            }
            if (data.user) {
                serviceStorage.setLoginVia('google')
                    .then(() => { })
                    .catch(() => { });
            }
            return data.user;
        } catch (err) {
            console.error(err.message);
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            return null;
        }
    }
    private _loginWithFacebook = async () => {
        try {
            const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
            if (result.isCancelled) {
                throw new Error("login cancelled.");
            }
            const accessData = await AccessToken.getCurrentAccessToken();
            if (!accessData) {
                throw new Error("something went wrong while obtaining access token.");
            }
            const fbc = auth.FacebookAuthProvider.credential(accessData.accessToken);
            const authData = await auth().signInWithCredential(fbc);
            const parseUser = await helperParse.checkAndSignup(this._getParseDetails(authData.user, 'facebook'));
            if (!parseUser) {
                LoginManager.logOut();
                throw new Error("parse server login/signup fail...");
            }
            if (authData.user) {
                serviceStorage.setLoginVia('facebook')
                    .then(() => { })
                    .catch(() => { });
            }
            return authData.user;
        } catch (err) {
            console.error(err.message);
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            return null;
        }
    }
    private _loginWithPhone = async () => {
        return null;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public loginWith = async (method: LoginMethod) => {
        switch (method) {
            case 'google':
                return await this._loginWithGoogle();
            case 'facebook':
                return await this._loginWithFacebook();
            case 'phone':
                return await this._loginWithPhone();
        }
    }

    public sendOtp = async (phoneNumber: string) => {
        try {
            this.phoneAuthConfirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
            return !!this.phoneAuthConfirmation;
        } catch (err) {
            console.error(err.message);
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            return false;
        }
    }
    public verifyOtp = async (otp: string) => {
        try {
            if (this.phoneAuthConfirmation) {
                const cc = await this.phoneAuthConfirmation.confirm(otp);
                if (cc?.user) {
                    this.phoneAuthConfirmation = undefined;
                    const parseUser = await helperParse.checkAndSignup(this._getParseDetails(cc.user, 'phone'));
                    if (!parseUser) {
                        await auth().signOut();
                        throw new Error("parse server login/signup fail...");
                    }
                    serviceStorage.setLoginVia('phone')
                        .then(() => { })
                        .catch(() => { });
                }
                return cc?.user ?? null;
            }
            throw new Error("please try again...");
        } catch (err) {
            const c_arr = (err as FirebaseAuthTypes.PhoneAuthError);
            console.error(c_arr.message);
            toaster.show({
                message: c_arr.message ?? "something went wrong...",
                gravity: 'CENTER'
            });
            return null;
        }
    }

    public logout = async () => {
        try {
            const method = await serviceStorage.getLoginVia();
            if (method !== 'none') {
                if (method === 'google') {
                    await GoogleSignin.revokeAccess();
                    await GoogleSignin.signOut();
                } else if (method === 'facebook') {
                    LoginManager.logOut();
                }
                await Promise.all([
                    auth().signOut(),
                    helperParse.logout(),
                    serviceStorage.setLoginVia('none')
                ]);
                return true;
            }
            throw new Error("something went wrong, try again.");
        } catch (err) {
            console.error(err.message);
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            return false;
        }
    }
}