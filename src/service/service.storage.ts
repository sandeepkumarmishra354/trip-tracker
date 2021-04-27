import AsyncStorage from '@react-native-community/async-storage';
import { IUserProfile, LoginMethod } from '../data-type/type.data';

class ServiceStorage {

    private readonly key_first_time = "first_time";
    private readonly key_login_via = "login_via";
    private readonly key_profile = "user_profile";

    public isFirstTime = async () => {
        try {
            const data = await AsyncStorage.getItem(this.key_first_time);
            if (data)
                return false;
            return true;
        } catch (err) {
            console.error(err.message);
            return true;
        }
    }

    public getLoginVia = async (): Promise<LoginMethod | 'none'> => {
        try {
            const type = (await AsyncStorage.getItem(this.key_login_via) as LoginMethod) ?? "none";
            return type;
        } catch (err) {
            console.error(err.message);
            return 'none';
        }
    }

    public setLoginVia = async (method: LoginMethod | 'none') => {
        try {
            await AsyncStorage.setItem(this.key_login_via, method);
            return true;
        } catch (err) {
            console.error(err.message);
            return false;
        }
    }

    public setAppAsOpened = async () => {
        try {
            await AsyncStorage.setItem(this.key_first_time, 'opened');
            return true;
        } catch (err) {
            console.error(err.message);
            return false;
        }
    }

    public saveUserProfile = async (profile: IUserProfile) => {
        try {
            await AsyncStorage.setItem(this.key_profile, JSON.stringify(profile));
            return profile;
        } catch (err) {
            console.error(err.message);
            return null;
        }
    }

    public getUserProfile = async () => {
        try {
            const dataStr = await AsyncStorage.getItem(this.key_profile);
            if (!dataStr) return null;
            return JSON.parse(dataStr) as IUserProfile;
        } catch (err) {
            console.error(err.message);
            return null;
        }
    }

    public removeUserProfile = async () => {
        try {
            await AsyncStorage.removeItem(this.key_profile);
            return true;
        } catch(err) {
            console.error(err.message);
            return false;
        }
    }
}

export const serviceStorage = new ServiceStorage();