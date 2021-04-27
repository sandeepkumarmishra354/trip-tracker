import axios, { AxiosInstance } from 'axios';
import Parse, { Installation } from 'parse/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Constants } from '../utils/constants';
import { Platform } from 'react-native';
// initialize parse server
Parse.setAsyncStorage(AsyncStorage);
Parse.enableLocalDatastore();
Parse.serverURL = "http://tripmembertracker.b4a.io/";
Parse.initialize("HxS4CTOIHYBKG1LV98AQtVGcoU81LnUr4q6oMvkt", "BTvG6VwKMPsMR8cSsLJlDGUeSKoiKdywSlYQTaCw");

export class API {
    private _axiosInstance!: AxiosInstance;
    private static instance: API;

    private constructor() { }

    public get axiosInstance() {
        if (!this._axiosInstance) {
            this._axiosInstance = axios.create({
                baseURL: `${Constants.baseUrl}/api/v1/`,
                responseType: 'json',
                validateStatus: status => true,
                timeout: 15000,//15 seconds (in miliseconds)
                timeoutErrorMessage: "request timeout, check your internet connection."
            });
        }
        return this._axiosInstance;
    }

    public get = () => {
    }
    public post = () => {
    }
    public update = () => {
    }
    public delete = () => {
    }

    public static getInstance = () => {
        if (!API.instance)
            API.instance = new API();
        return API.instance;
    }

    public static setupParseInstallation = async () => {
        try {
            const installation = new Installation();
            installation.set("deviceType", Platform.OS);
            installation.set("platformVersion", Platform.Version);
            await installation.save();
        } catch (err) {
            console.error(err.message);
        }
    }
}