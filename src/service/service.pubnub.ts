import PubNub from "pubnub";

export type PNUnsubscribe = () => void;
export type PNMessageListener = (data: any) => void;

export class ServicePubnub {

    private _initiated = false;
    private _pubnub!: PubNub;
    private _channelAndListener = new Map<string, PNMessageListener>();

    public init = (email: string) => {
        if (!this._initiated) {
            this._pubnub = new PubNub({
                subscribeKey: "sub-c-c799285a-a8f4-11eb-b2e3-7226f347561f",
                uuid: email,// don't change this
            });
            this._initiated = true;
        }
    }

    public subscribe = (channel: string, listener: PNMessageListener): PNUnsubscribe | null => {
        if (this._initiated) {
            this._channelAndListener.set(channel, listener);
            this._pubnub.subscribe({
                channels: [channel]
            });
            this._pubnub.addListener({
                message: (event) => {
                    this._channelAndListener.get(event.channel)?.(event.message);
                }
            });
            return () => {
                if (this._initiated) {
                    this.unsubscribe(channel);
                }
            }
        }
        return null;
    }

    public unsubscribe = (channel: string) => {
        if (this._channelAndListener.delete(channel)) {
            if (this._initiated) {
                this._pubnub.unsubscribe({ channels: [channel] });
            }
        }
    }

    public doCleanup = () => {
        const channels = this._channelAndListener.keys();
        for (let channel of channels) {
            this.unsubscribe(channel);
        }
    }
}