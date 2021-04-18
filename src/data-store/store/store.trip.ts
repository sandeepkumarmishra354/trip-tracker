import { makeAutoObservable, runInAction } from "mobx";
import { ServiceTrip } from "../../service/service.trip";
import { AppDataStore } from "../app.store";

export interface ITripOption {
    name: string,
    destination: string,
    members: number
}

export class StoreTrip {

    private _creatingTrip = false;

    constructor(private rootStore: AppDataStore, private serviceTrip: ServiceTrip) {
        makeAutoObservable(this);
    }

    public get creatingTrip() { return this._creatingTrip; }

    public createTrip = async (data: ITripOption): Promise<boolean> => {
        return new Promise((res,rej) => {
            runInAction(() => {
                this._creatingTrip = true;
            });
            setTimeout(() => {
                runInAction(() => {
                    this._creatingTrip = false;
                });
                res(true);
            }, 2000);
        });
    }
}