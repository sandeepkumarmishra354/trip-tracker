import axios, { AxiosInstance } from 'axios';
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Constants } from '../utils/constants';
import { Platform } from 'react-native';

const ParseConfig = {
    app_id: "HxS4CTOIHYBKG1LV98AQtVGcoU81LnUr4q6oMvkt",
    js_key: "BTvG6VwKMPsMR8cSsLJlDGUeSKoiKdywSlYQTaCw",
    server_url: "http://tripmembertracker.b4a.io/",
    initialised: false,
}
// initialize parse server
const init = () => {
    if (!ParseConfig.initialised) {
        Parse.setAsyncStorage(AsyncStorage);
        Parse.enableLocalDatastore();
        Parse.serverURL = ParseConfig.server_url;
        Parse.initialize(ParseConfig.app_id, ParseConfig.js_key);
        ParseConfig.initialised = true;
    }
}

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
                timeout: 15_000,//15 seconds (in miliseconds)
                timeoutErrorMessage: "request timeout, check your internet connection."
            });
        }
        return this._axiosInstance;
    }

    public get = () => {
        //
    }
    public post = () => {
        //
    }
    public update = () => {
        //
    }
    public delete = () => {
        //
    }

    public static getInstance = () => {
        if (!API.instance)
            API.instance = new API();
        return API.instance;
    }

    public static setupParseInstallation = async () => {
        try {
            init();
            const installation = new Parse.Installation();
            installation.set("deviceType", Platform.OS);
            installation.set("platformVersion", Platform.Version);
            await installation.save();
        } catch(err) {
            console.error(err);
        }
    }
}