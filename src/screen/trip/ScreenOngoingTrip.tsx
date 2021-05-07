import React from 'react';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Loading } from "../../common/Loading";
import { useRootStore } from "../../common/RootStoreProvider";
import ScreenContainer from "../../common/ScreenContainer";
import { IOngoingTripData } from "../../data-store/store/store.trip";
import { AppScreens, NavigationProps } from "../../navigation/navigation.types";
import { snackbar } from "../../utils/snackbar";
import Parse from 'parse/react-native';
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Divider, List, Subheading } from "react-native-paper";
import { TripStatus } from "../../service/service.trip";

interface ITripProps {
    trip: IOngoingTripData,
    onSuccess(status: boolean): void
}

const TripDetails = observer((props: ITripProps) => {
    const { cancellingTrip, finishingTrip, finishTrip, cancelTrip } = useRootStore().storeTrip;
    const trip = props.trip;
    const showAction = trip.isHost && ![TripStatus.CANCELLED, TripStatus.FINISHED].includes(trip.status)

    const finish = () => {
        finishTrip()
            .then(props.onSuccess)
            .catch(() => { });
    }
    const cancel = () => {
        cancelTrip()
            .then(props.onSuccess)
            .catch(() => { });
    }

    return (
        <View
            style={styles.container}>
            <Card
                style={styles.cardStyle}
                elevation={4}>
                <Card.Title title="Trip Details" />
                <View style={{ width: '100%', padding: 5 }}>
                    <Subheading>
                        Trip Name: {trip.name}
                    </Subheading>
                    <Subheading>
                        Trip Destination: {trip.destination}
                    </Subheading>
                    <Subheading>
                        Trip Description: {trip.description}
                    </Subheading>
                    <Subheading style={{color:'green'}} selectable>
                        Trip Id: {trip.tripId}
                    </Subheading>
                    <Subheading>
                        Created At: {trip.createdAt}
                    </Subheading>
                    <Subheading>
                        End At: {trip.endAt}
                    </Subheading>
                    <Subheading>
                        Max Member: {trip.maxMember}
                    </Subheading>
                    <Subheading>
                        Trip Status: {trip.status}
                    </Subheading>
                </View>
                {
                    showAction &&
                    <>
                        <Divider />
                        <Card.Actions style={{ justifyContent: 'flex-end' }}>
                            {trip.status === TripStatus.PLANNED && <Button
                                color="#B9345A"
                                disabled={cancellingTrip || finishingTrip}
                                loading={cancellingTrip}
                                onPress={cancel}>
                                Cancel Trip
                    </Button>}
                            {trip.status === TripStatus.STARTED && <Button
                                color="#1B98F5"
                                disabled={cancellingTrip || finishingTrip}
                                loading={finishingTrip}
                                onPress={finish}>
                                Finish Trip
                    </Button>}
                        </Card.Actions>
                    </>
                }
            </Card>

            <Card
                style={styles.cardStyle}
                elevation={4}>
                <Card.Title title="Members" />
                <View style={{ width: '100%', padding: 5 }}>
                    {
                        trip.members.map((member, index) => (
                            <>
                                <List.Item
                                    key={`${index}`}
                                    title={member.name}
                                    left={() => {
                                        return <Avatar.Image
                                            size={32}
                                            source={{ uri: member.photo }} />;
                                    }} />
                                <Divider key={`${index + 100}`} />
                            </>
                        ))
                    }
                </View>
            </Card>
        </View>
    );
});

interface Props extends NavigationProps<AppScreens.TRIP_ONGOING> {
    //
}

export const ScreenOngoingTrip = (props: Props) => {
    const navigation = props.navigation;
    const [data, setData] = useState<{ fetching: boolean, trip: IOngoingTripData | null }>({
        fetching: true,
        trip: null
    });

    const onOpSuccess = (status: boolean) => {
        if (status)
            navigation.popToTop();
    }

    useEffect(() => {
        Parse.Cloud.run("trip-ongoing")
            .then(res => {
                setData({
                    fetching: false,
                    trip: res
                });
            })
            .catch(err => {
                snackbar.show({ message: err.message, type: 'error' });
                setData({
                    fetching: false,
                    trip: null
                });
            })
    }, []);

    return (
        <ScreenContainer
            title="Ongoing trip"
            showBack={navigation.goBack}>
            {
                data.fetching
                    ?
                    <Loading />
                    :
                    (data.trip !== null)
                        ?
                        <TripDetails trip={data.trip} onSuccess={onOpSuccess} />
                        :
                        null
            }
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: "#F8F8FF"
    },
    cardStyle: {
        marginHorizontal: 5,
        marginVertical: 8,
        width: '100%',
        borderRadius: 0
    }
});