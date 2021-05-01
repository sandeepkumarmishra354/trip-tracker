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

    public sendText = async (message: string) => {
        //
    }

    public sendImage = async (fileUrl: string) => {
        //
    }

    public loadAll = async () => {
        try {
            const result = <IMessage[]> await Parse.Cloud.run("message-list");
            return result;
        } catch(err) {
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