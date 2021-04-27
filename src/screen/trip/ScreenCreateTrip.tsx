import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import ScreenContainer from '../../common/ScreenContainer';
import { AppScreens, NavigationProps } from '../../navigation/navigation.types';
import { Image, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyTextInput } from '../../common/MyTextInput';
import MyButton from '../../common/MyButton';
import { useRootStore } from '../../common/RootStoreProvider';
import { snackbar } from '../../utils/snackbar';
import { DialogTripCreated } from './DialogTripCreated';

interface Props extends NavigationProps<AppScreens.CREATE_TRIP> {
    //
}

const ScreenCreateTrip = (props: Props) => {

    const storeTrip = useRootStore().storeTrip;
    const navigation = props.navigation;
    const [tripName, setTripName] = useState("");
    const [destination, setDestination] = useState("");
    const [members, setMembers] = useState("");
    const [description, setDescription] = useState("");
    const [createdData, setCreatedData] = useState({ success: false, tripId: "" });

    const onCreatePress = async () => {
        if (tripName && destination && members) {
            const result = await storeTrip.createTrip({
                name: tripName,
                destination, description,
                maxMember: Number(members)
            });
            if (result) {
                setCreatedData({ success: true, tripId: result.tripId });
            }
        } else {
            snackbar.show({
                message: "please fill all details...",
                type: 'error'
            });
        }
    }

    const onDialogDismiss = () => {
        setCreatedData({ ...createdData, success: false });
        storeTrip.checkForJoinedTrip()
            .then(() => { })
            .catch(() => { });
        navigation.goBack();
    }

    return (
        <ScreenContainer
            title="Create new trip"
            showBack={navigation.goBack}>
            <ScrollView>
                <View
                    style={{ width: '100%', paddingHorizontal: 18 }}>
                    <Image
                        style={{
                            width: "70%",
                            height: 220,
                            resizeMode: 'contain',
                            alignSelf: 'center'
                        }}
                        source={require("../../assets/images/create_trip.png")} />

                    <MyTextInput
                        style={styles.input}
                        label="Trip name *"
                        value={tripName}
                        onChangeText={setTripName}
                        disabled={storeTrip.creatingTrip} />
                    <MyTextInput
                        style={styles.input}
                        label="Destination *"
                        value={destination}
                        onChangeText={setDestination}
                        disabled={storeTrip.creatingTrip} />
                    <MyTextInput
                        style={styles.input}
                        label="Total member *"
                        type="number-pad"
                        value={members}
                        onChangeText={setMembers}
                        disabled={storeTrip.creatingTrip} />
                    <MyTextInput
                        style={styles.input}
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        disabled={storeTrip.creatingTrip} />
                    <MyButton
                        style={{ marginVertical: 22, marginHorizontal: 42 }}
                        label="create trip"
                        borderRadius={3}
                        elevation={1}
                        loading={storeTrip.creatingTrip}
                        disabled={storeTrip.creatingTrip}
                        onPress={onCreatePress} />
                </View>
            </ScrollView>
            <DialogTripCreated
                visible={createdData.success}
                onDismiss={onDialogDismiss}
                tripId={createdData.tripId} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 45,
        marginBottom: 16
    }
});

export default observer(ScreenCreateTrip);