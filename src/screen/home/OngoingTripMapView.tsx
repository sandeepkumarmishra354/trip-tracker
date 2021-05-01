import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { FAB, Subheading } from 'react-native-paper';
import { useRootStore } from '../../common/RootStoreProvider';
import { ILiveLocationData } from '../../data-store/store/store.location';

interface IMarkerProps {
    data: ILiveLocationData
}

const UserLocationMarker = React.memo((props: IMarkerProps) => {
    return null;
});

interface Props {
    onFabPress(): void
}

export const OngoingTripMapView = observer((props: Props) => {

    const storeLocation = useRootStore().storeLocation;
    const location = storeLocation.myCurrentLocation;

    useEffect(() => {
        storeLocation.initiate()
            .then((status) => {
                console.log(`location started: ${status}`);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        return () => {
            storeLocation.doCleanup();
        }
    });

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Subheading>
                {
                    location
                        ?
                        `Lat: ${location.latitude}\nLng: ${location.longitude}`
                        :
                        ""
                }
            </Subheading>
            <FAB
                style={{ position: 'absolute', bottom: 16, right: 16 }}
                icon="chatbubble-outline"
                small={false}
                onPress={props.onFabPress} />
        </View>
    );
});