import { toaster } from "../utils/toaster";
import { API } from "./api";
import Parse from 'parse/react-native';

export interface IMessage {
    id: string,
    tripId: string,
    createdAt: string,
    message: string,
    sender: {
        name: string,
        photo: string,
        email: string,
    },
    isMe: boolean
}

export class ServiceMessage {

    constructor(private api: API) {
        //
    }

    public sendText = async (tripId: string, message: string) => {
        try {
            const result = <IMessage> await Parse.Cloud.run("message-send", { tripId, message });
            return result;
        } catch (err) {
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            console.error(err);
            return null;
        }
    }

    public sendImage = async (tripId: string, fileUrl: string) => {
        try {
            return null;
        } catch (err) {
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            console.error(err);
            return null;
        }
    }

    public loadAll = async (tripId: string) => {
        try {
            const result = <IMessage[]>await Parse.Cloud.run("message-list", { tripId });
            return result;
        } catch (err) {
            toaster.show({
                message: err.message,
                gravity: 'CENTER'
            });
            return null;
        }
    }

    // cancel any subscription.
    public doCleanup = () => {
        //
    }
}