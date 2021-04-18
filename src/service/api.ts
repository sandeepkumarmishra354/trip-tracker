import axios, { AxiosInstance } from 'axios';
import { Constants } from '../utils/constants';

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
        if (!this.instance)
            this.instance = new API();
        return this.instance;
    }
}