import { makeAutoObservable, runInAction } from "mobx";
import { IMessage, ServiceMessage } from "../../service/service.message";
import { AppDataStore } from "../app.store";

export class StoreMessage {

    private _loadingMessage = false;
    private _sendingMessage = false;
    private _messages: IMessage | null = null;

    constructor(private rootStore: AppDataStore, private serviceMessage: ServiceMessage) {
        makeAutoObservable(this);
    }

    public get loadingMessage() { return this._loadingMessage; }
    public get sendingMessage() { return this._sendingMessage; }
    public get messages() { return this._messages; }

    public sendText = async (message: string) => {
        runInAction(() => { this._sendingMessage = true; });
        this.serviceMessage.sendText(message);
    }

    public sendImage = async (fileUrl: string) => {
        runInAction(() => { this._sendingMessage = true; });
        this.serviceMessage.sendImage(fileUrl);
    }

    public loadAll = async () => {
        runInAction(() => { this._loadingMessage = true; });
        const result = await this.serviceMessage.loadAll();
        runInAction(() => {
            this._loadingMessage = true;
            this._messages = result;
        });
    }

    // cancel any subscription.
    public doCleanup = () => {
        this.serviceMessage.doCleanup();
    }
}