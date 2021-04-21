import Parse from 'parse/react-native';
import { toaster } from "../../utils/toaster";

export interface IParseAuthOption {
    username: string,
    email: string,
    fullname: string,
    token: string,
    photo: string,
    method: 'google' | 'facebook' | 'phone' | 'none'
}
export interface ILoginOption {
    username: string,
    token: string
}
interface IResData extends IParseAuthOption {
    createdAt: Date,
    sessionToken: string
}
export interface IParseAuthResponse {
    success: boolean,
    message: string,
    data: IResData
}

class HelperParse {

    private _login = async (data: ILoginOption) => {
        try {
            const res = (await Parse.Cloud.run("login", data)) as IParseAuthResponse;
            return res;
        } catch (err) {
            return undefined;
        }
    }

    private _signup = async (data: IParseAuthOption) => {
        try {
            const res = (await Parse.Cloud.run("signup", data)) as IParseAuthResponse;
            return res;
        } catch (err) {
            return undefined;
        }
    }

    private _becomeParseUser = async (session: string) => {
        const user = await Parse.User.become(session);
        return user;
    }

    public checkAndSignup = async (data: IParseAuthOption) => {
        try {
            // first try to login
            const loginRes = await this._login({ username: data.username, token: data.token });
            if(loginRes && loginRes.success) {
                return await this._becomeParseUser(loginRes.data.sessionToken);
            } else {
                // try to signup
                const signupRes = await this._signup(data);
                if(signupRes && signupRes.success) {
                    return await this._becomeParseUser(signupRes.data.sessionToken);
                }
                throw new Error(signupRes?.message ?? "can't perform login/signup action.");
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