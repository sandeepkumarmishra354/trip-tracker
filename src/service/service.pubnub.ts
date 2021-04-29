import PubNub from "pubnub";

export type PNUnsubscribe = () => void;
export type PNMessageListener = (data: any) => void;

class ServicePubnub {

    private _initiated = false;
    private _pubnub!: PubNub;

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
            this._pubnub.subscribe({
                channels: [channel]
            });
            this._pubnub.addListener({
                message: (event) => {
                    if (event.channel === channel) {
                        listener(event.message);
                    }
                }
            });
            return () => {
                if (this._initiated)
                    this._pubnub.unsubscribe({ channels: [channel] });
            }
        }
        return null;
    }
}

export const servicePubnub = new ServicePubnub();