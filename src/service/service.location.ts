import RNLocation, { Subscription, Location } from 'react-native-location';
import { API } from "./api";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { snackbar } from '../utils/snackbar';
import Parse from 'parse/react-native';
import { toaster } from '../utils/toaster';

export type MyLocation = Location;
type LocationListener = (location: MyLocation) => void;

export class ServiceLocation {

    private readonly rationale = {
        title: "Location permission",
        message: "location permission is required, in order to provide best user experience.",
        buttonPositive: "OK",
        buttonNegative: "CANCEL",
    };

    private _configured = false;
    private _locationCallback: LocationListener | null = null;
    private _locationUpdateUnsubscribe!: Subscription;

    constructor(private api: API) {
        //
    }

    private _onLocationUpdate = (locations?: Location[]) => {
        console.log(`${locations}`);
        // get the latest location
        const location = locations?.reduce((prev, curr) => {
            return prev.timestamp > curr.timestamp ? prev : curr;
        });
        if (location) {
            Parse.Cloud.run("trip-update-location", {
                latitude: location.latitude,
                longitude: location.longitude
            }).then(res => {
                console.log(res);
            })
                .catch(err => {
                    toaster.show({ message: err.message, gravity: 'CENTER' });
                });
            this._locationCallback?.(location);
        }
    }
    private _requestEnableGPS = async () => {
        try {
            const res = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                fastInterval: 8000 * 2,
                interval: 8000
            });
            return true;
        } catch (err) {
            console.error(err.message);
            snackbar.show({
                message: err.message,
                type: 'error'
            });
            return false;
        }
    }
    private _requestForPermission = async () => {
        try {
            if (this._configured) {
                // check if location permission is granted
                const hasPermission = await RNLocation.checkPermission({
                    android: {
                        detail: 'fine',
                        rationale: this.rationale
                    }
                });
                if (!hasPermission) {
                    // here request for location permission.
                    const isGranted = await RNLocation.requestPermission({
                        android: {
                            detail: 'fine',
                            rationale: this.rationale
                        }
                    });
                    return isGranted;
                }
                return true;
            }
            throw new Error("location settings not configured.");
        } catch (err) {
            console.error(err.message);
            return false;
        }
    }

    public configure = async (onLocation: LocationListener) => {
        if (!this._configured) {
            try {
                this._locationCallback = onLocation;
                await RNLocation.configure({
                    distanceFilter: 10.0,// in meter
                    desiredAccuracy: {
                        android: 'balancedPowerAccuracy',
                        ios: 'best'
                    },
                    interval: 8000,// 8 seconds
                });
                this._configured = true;
            } catch (err) {
                console.error(`location configuration error: ${err.message}`);
                this._configured = false;
                this._locationCallback = null;
            }
        }
        return this._configured;
    }

    public start = async () => {
        const granted = await this._requestForPermission();
        if (granted) {
            const enabled = await this._requestEnableGPS();
            if (enabled) {
                this._locationUpdateUnsubscribe = RNLocation.subscribeToLocationUpdates(this._onLocationUpdate);
                return true;
            }
            return false;
        }
        return false;
    }

    // cancel any subscription.
    public doCleanup = () => {
        this._locationUpdateUnsubscribe?.();
    }
}