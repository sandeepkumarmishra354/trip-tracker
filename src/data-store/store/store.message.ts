import { makeAutoObservable, runInAction } from "mobx";
import { IMessage, ServiceMessage } from "../../service/service.message";
import { PNUnsubscribe } from "../../service/service.pubnub";
import { PublisherChannel } from "../../utils/constants";
import { toaster } from "../../utils/toaster";
import { AppDataStore } from "../app.store";

export class StoreMessage {

    private _isLoaded = false;
    private _loadingMessage = true;
    private _sendingMessage = false;
    private _unreadMessage = "";
    private _messages: IMessage[] | null = null;
    private _msgUnsubscriber: PNUnsubscribe | null = null;
    private readonly tripId;
    private readonly userEmail;

    constructor(private rootStore: AppDataStore, private serviceMessage: ServiceMessage) {
        makeAutoObservable(this);
        this.tripId = rootStore.storeTrip.joinedTrip?.tripId ?? "";
        this.userEmail = rootStore.storeAuth.getEmail();
        this._subscribeToMessage();
    }

    public get loadingMessage() { return this._loadingMessage; }
    public get sendingMessage() { return this._sendingMessage; }
    public get messages() {
        if (this._messages === null)
            return null;
        return this._messages.slice().reverse();
    }
    public get unreadMessage() { return this._unreadMessage; }

    private _reducer = (accumulator: IMessage[], currentValue: IMessage) => {
        if (!accumulator.find(obj => obj.id === currentValue.id)) {
            accumulator.push(currentValue);
        }
        return accumulator;
    };

    private _onNewMessage = (newMessage: IMessage) => {
        console.log(newMessage);
        if (newMessage.sender.email !== this.userEmail) {
            runInAction(() => {
                this._unreadMessage = "•";
                if (this._messages !== null) {
                    this._messages = [...this._messages, newMessage].reduce(this._reducer, []);
                } else {
                    this._messages = [newMessage];
                }
            });
        }
    }

    private _subscribeToMessage = () => {
        if (!this._msgUnsubscriber && this.tripId) {
            const channel = PublisherChannel.newMessage(this.tripId);
            this._msgUnsubscriber = this.rootStore.servicePubnub.subscribe(channel, this._onNewMessage);
        }
    }

    public sendText = async (message: string) => {
        toaster.show({
            message: "sending...",
            gravity: 'CENTER'
        });
        runInAction(() => { this._sendingMessage = true; });
        const result = await this.serviceMessage.sendText(this.tripId, message);
        runInAction(() => {
            this._sendingMessage = false;
            if (result) {
                if (this._messages !== null) {
                    this._messages = [...this._messages, result].reduce(this._reducer, []);
                } else {
                    this._messages = [result];
                }
            }
        });
    }

    public sendImage = async (fileUrl: string) => {
        runInAction(() => { this._sendingMessage = true; });
        this.serviceMessage.sendImage(this.tripId, fileUrl);
    }

    public loadAll = async () => {
        if (!this._isLoaded) {
            runInAction(() => { this._loadingMessage = true; });
            const result = await this.serviceMessage.loadAll(this.tripId);
            runInAction(() => {
                this._loadingMessage = false;
                this._messages = result ?? [];
            });
            this._isLoaded = !!result;
        }
    }

    public resetUnreadMessages = () => {
        runInAction(() => { this._unreadMessage = ""; });
    }


    // cancel any subscription.
    public doCleanup = () => {
        this._msgUnsubscriber?.();
        this.serviceMessage.doCleanup();
    }
}