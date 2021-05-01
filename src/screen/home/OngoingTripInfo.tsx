import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import { Caption, Headline, Subheading } from "react-native-paper";
import MyButton from "../../common/MyButton";
import { useRootStore } from "../../common/RootStoreProvider";
import { IJoinedTrip, TripStatus } from "../../service/service.trip";

interface Props {
    trip: IJoinedTrip,
}

export const OngoingTripInfo = observer((props: Props) => {

    const storeTrip = useRootStore().storeTrip;

    const startTrip = () => {
        storeTrip.startTrip()
            .then(() => { })
            .catch(() => { });
    }

    return (
        <View style={{ width: "100%", flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 }}>
            <Headline style={{ textAlign: 'center' }}>
                {props.trip.name}
            </Headline>
            <Subheading style={{ marginVertical: 10, textAlign: 'center' }}>
                {props.trip.destination}
            </Subheading>
            <Caption
                style={{ color: "#3DBE29", fontWeight: 'bold' }}
                selectable>
                {props.trip.tripId}
            </Caption>
            <View
                style={{
                    width: '100%', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center',
                    paddingVertical: 5, marginTop: 8
                }}>
                <Subheading style={{ marginRight: 5, marginLeft: 8, textAlign: 'center' }}>
                    Joined: {props.trip.joined}
                </Subheading>
                <Subheading style={{ marginLeft: 5, textAlign: 'center' }}>
                    Remaining: {props.trip.remaining}
                </Subheading>
            </View>
            {
                props.trip.status === TripStatus.PLANNED
                    ?
                    props.trip.isHost
                        ?
                        <MyButton
                            style={{ width: '70%', marginTop: 25 }}
                            label="start trip"
                            elevation={2}
                            borderRadius={3}
                            onPress={startTrip}
                            loading={storeTrip.startingTrip}
                            disabled={storeTrip.startingTrip} />
                        :
                        <Caption
                            style={{ marginTop: 25, textAlign: 'center' }}>
                            Waiting for host to start the trip...
                </Caption>
                    :
                    null
            }
        </View>
    );
});