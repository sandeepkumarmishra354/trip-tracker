import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react'
import { Image, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import MyActionSheet from '../../common/MyActionSheet';
import MyButton from '../../common/MyButton';
import { MyTextInput } from '../../common/MyTextInput';

interface Props {
    onCreateTrip(): void
}

const HomeNoTrip = React.memo((props: Props) => {

    const actionSheet = React.createRef<MyActionSheet>();
    const [tripid, setTripid] = useState("");
    const { colors } = useTheme() as any;

    const createTrip = () => {
        props.onCreateTrip();
    }
    const joinTrip = () => {
        actionSheet.current?.show();
    }
    const actionSheetJoin = () => {
        actionSheet.current?.hide();
    }
    const actionSheetTripIdChange = (text: string) => {
        setTripid(text);
    }

    return (
        <View style={{ width: "100%", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
                style={{
                    width: "70%",
                    height: 220,
                    marginBottom: 40,
                    resizeMode: 'contain'
                }}
                source={require("../../assets/images/trip_car.png")} />
            <View
                style={{ width: '100%', alignItems: 'center', marginTop: 12 }}>
                <MyButton
                    style={{ marginVertical: 12, width: '90%' }}
                    padding={2}
                    borderRadius={3}
                    elevation={1}
                    color="#db4a39"
                    label="create trip"
                    icon="create-outline"
                    onPress={createTrip} />
                <MyButton
                    style={{ marginVertical: 8, width: '90%' }}
                    padding={2}
                    borderRadius={3}
                    elevation={1}
                    label="join trip"
                    icon="log-in-outline"
                    color={colors.accent}
                    onPress={joinTrip} />
            </View>
            <MyActionSheet
                ref={actionSheet}
                dismissOnTouch={false}>
                <View
                    style={{ alignItems: 'center', padding: 12 }}>
                    <Subheading
                        style={{ marginBottom: 30 }}>
                        ENTER TRIP ID TO JOIN
                        </Subheading>
                    <MyTextInput
                        style={{width:'90%'}}
                        placeholder="Type here..."
                        value={tripid}
                        onChangeText={actionSheetTripIdChange} />
                    <MyButton
                        style={{ width: '60%', marginTop: 30 }}
                        borderRadius={2}
                        elevation={1}
                        label="join now"
                        color={colors.accent}
                        onPress={actionSheetJoin} />
                </View>
            </MyActionSheet>
        </View>
    );
});

export default HomeNoTrip;