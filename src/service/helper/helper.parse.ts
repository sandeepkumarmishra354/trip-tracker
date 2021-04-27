import Parse from 'parse/react-native';
import { IAuthResponseData, ILoginData, IUserAuthData } from '../../data-type/type.data';
import { toaster } from "../../utils/toaster";

class HelperParse {

    private _login = async (data: ILoginData) => {
        try {
            const res = (await Parse.Cloud.run("login", data)) as IAuthResponseData;
            return res;
        } catch (err) {
            return undefined;
        }
    }

    private _signup = async (data: IUserAuthData) => {
        try {
            const res = (await Parse.Cloud.run("signup", data)) as IAuthResponseData;
            return res;
        } catch (err) {
            return undefined;
        }
    }

    private _becomeParseUser = async (session: string) => {
        const user = await Parse.User.become(session);
        return user;
    }

    public checkAndSignup = async (data: IUserAuthData) => {
        try {
            // first try to login
            const loginRes = await this._login({ username: data.username, method: data.method });
            if(loginRes) {
                return await this._becomeParseUser(loginRes.sessionToken);
            } else {
                // try to signup
                const signupRes = await this._signup(data);
                if(signupRes) {
                    return await this._becomeParseUser(signupRes.sessionToken);
                }
                throw new Error("can't perform login/signup action.");
            }
        } catch (err) {
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            return undefined;
        }
    }

    public logout = () => Parse.User.logOut();
}

export const helperParse = new HelperParse();