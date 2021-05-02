import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Avatar, Badge, FAB } from 'react-native-paper';
import { useRootStore } from '../../common/RootStoreProvider';
import { ILiveLocationData } from '../../data-store/store/store.location';
import MapView, { Marker } from 'react-native-maps';
import { MyLocation } from '../../service/service.location';


interface PointerProps {
    image: string
}

const MarkerPointer = React.memo((props: PointerProps) => {

    const image = props.image;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {
                image.length === 1
                    ?
                    <Avatar.Text
                        style={{ marginBottom: -5, zIndex: 1 }}
                        label={image.toUpperCase()}
                        size={32} />
                    :
                    <Avatar.Image
                        style={{ marginBottom: -5, zIndex: 1 }}
                        source={{ uri: props.image }}
                        size={32} />
            }
            <View
                style={{
                    width: 6, height: 40, backgroundColor: '#1B98F5',
                    borderRadius: 8
                }} />
        </View>
    );
});

interface IMarkerProps {
    data: ILiveLocationData[]
}

class UserLocationMarker extends React.PureComponent<IMarkerProps> {

    render() {
        const data = this.props.data;
        return data.map(d => (
            <Marker
                key={`${d.timestamp}`}
                coordinate={{ latitude: d.latitude, longitude: d.longitude }}
                title={d.user.name}
                description={d.user.email}>
                <MarkerPointer image={d.user.photo} />
            </Marker>
        ));
    }

}

interface MyLocationProps {
    location: MyLocation | null
}

const MyLocationMarker = React.memo((props: MyLocationProps) => {

    const user = useRootStore().storeAuth.parseUser;
    const location = props.location;
    const title = user?.get("name") ?? "ME";
    const image = user?.get("photo") ?? title.charAt(0);
    const description = user?.getEmail() ?? "";

    if (!location) return null;

    return (
        <Marker
            coordinate={{ ...location }}
            title={`${title} (ME)`}
            description={description}>
            <MarkerPointer image={image} />
        </Marker>
    );
});

interface IFabProps {
    onFabPress(): void
}

const FabMessage = observer((props: IFabProps) => {

    const storeMessage = useRootStore().storeMessage;

    return (
        <FAB
            style={{ position: 'absolute', bottom: 16, right: 16 }}
            icon="chatbubble-outline"
            small={false}
            label={storeMessage.unreadMessage}
            onPress={props.onFabPress}>
        </FAB>
    );
});

interface Props {
    onFabPress(): void
}

export const OngoingTripMapView = observer((props: Props) => {

    const storeLocation = useRootStore().storeLocation;
    const location = storeLocation.myCurrentLocation;
    const membersLocation = storeLocation.membersLocation;

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
            <MapView
                style={{ flex: 1, width: '100%' }}
                region={location ? {
                    ...location,
                    latitudeDelta: 0,
                    longitudeDelta: 0
                } : undefined}
                maxZoomLevel={15}
                moveOnMarkerPress
                showsBuildings
                showsTraffic
                showsCompass
                loadingEnabled>
                <MyLocationMarker location={location} />
                {(membersLocation && membersLocation.length > 0)
                    &&
                    <UserLocationMarker data={membersLocation} />}
            </MapView>
            <FabMessage onFabPress={props.onFabPress} />
        </View>
    );
});