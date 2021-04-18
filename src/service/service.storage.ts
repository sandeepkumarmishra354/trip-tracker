import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginMethod } from './service.auth';

class ServiceStorage {

    private readonly key_first_time = "first_time";
    private readonly key_login_via = "login_via";

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
}

export const serviceStorage = new ServiceStorage();