import RNLocation, { LocationPermissionStatus, Subscription, Location } from 'react-native-location';
import { API } from "./api";

export class ServiceLocation {

    private readonly rationale = {
        title: "Location permission",
        message: "location permission is required, in order to provide best user experience.",
        buttonPositive: "OK",
        buttonNegative: "CANCEL",
    };

    private _configured = false;
    private _permissionUnsubscribe!: Subscription;
    private _locationUpdateUnsubscribe!: Subscription;

    constructor(private api: API) {
        //
    }

    private _onPermissionChange = (status: LocationPermissionStatus) => {
        if (
            status === 'authorizedFine'
            || status === 'authorizedCoarse'
            || status === 'authorizedAlways'
        ) {
            this._locationUpdateUnsubscribe = RNLocation.subscribeToLocationUpdates(this._onLocationUpdate);
        }
    }
    private _onLocationUpdate = (locations: Location[]) => {
        //
    }

    public configure = async () => {
        try {
            await RNLocation.configure({
                distanceFilter: 10.0,// in meter
                desiredAccuracy: {
                    android: 'balancedPowerAccuracy',
                    ios: 'best'
                },
                interval: 8000,// 8 seconds
            });
            this._configured = true;
            this._permissionUnsubscribe = RNLocation.subscribeToPermissionUpdates(this._onPermissionChange);
        } catch (err) {
            console.error(`location configuration error: ${err.message}`);
            this._configured = false;
        }
    }

    public requestForPermission = async () => {
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

    // cancel any subscription.
    public doCleanup = () => {
        if (this._permissionUnsubscribe)
            this._permissionUnsubscribe();

        if (this._locationUpdateUnsubscribe)
            this._locationUpdateUnsubscribe();
    }
}