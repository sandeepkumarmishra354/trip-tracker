import { API } from "./api";

export interface IMessage {
    id: string,
    time: string,
    text: string,
    imageUrl: string,
    sender: {
        id: string,
        name: string,
        photo: string,
        isMe: boolean
    },
    tripId: string
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
        return null;
    }

    // cancel any subscription.
    public doCleanup = () => {
        //
    }
}