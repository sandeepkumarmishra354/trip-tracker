import { snackbar } from "../utils/snackbar";
import { API } from "./api";
import Parse from 'parse/react-native';
import { toaster } from "../utils/toaster";

export enum TripStatus {
    PLANNED = "PLANNED",
    STARTED = "STARTED",
    CANCELLED = "CANCELLED",
    FINISHED = "FINISHED",
}
export interface ITripCreateData {
    name: string,
    destination: string,
    maxMember: number,
    description?: string
}
export interface ITripCreated {
    id: string,
    destination: string,
    maxMember: number,
    description: string,
    name: string,
    tripId: string,
    status: TripStatus,
}
export interface IJoinedTrip {
    tripId: string,
    destination: string,
    name: string,
    status: TripStatus,
    tripHostName: string,
    tripHostEmail: string,
    joined: number,
    remaining: number
}

export class ServiceTrip {
    constructor(private api: API) {
        //
    }

    public createTrip = async (data: ITripCreateData) => {
        try {
            const result = <ITripCreated>await Parse.Cloud.run("trip-create", data);
            if (!result) throw new Error("something went wrong, trip not created.");
            return result;
        } catch (err) {
            snackbar.show({
                message: err.message,
                type: 'error'
            });
            return null;
        }
    }

    public joinTrip = async (tripId: string) => {
        try {
            const result = <IJoinedTrip>await Parse.Cloud.run("trip-join", { tripId });
            if (!result) throw new Error("something went wrong, unable to join trip.");
            return result;
        } catch (err) {
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            return null;
        }
    }

    public startTrip = async () => {
        //
    }

    public finishTrip = async () => {
        //
    }

    public cancelTrip = async () => {
        //
    }

    public updateCurrentLocation = async () => {
        //
    }

    public getOngoingTrip = async () => {
        try {
            const result = <IJoinedTrip>await Parse.Cloud.run("trip-get-active");
            if (!result) throw new Error("something went wrong.");
            return result;
        } catch (err) {
            snackbar.show({
                message: err.message,
                type: 'error'
            });
            return null;
        }
    }

    public getTrips = async (status: TripStatus) => {
        //
    }
}