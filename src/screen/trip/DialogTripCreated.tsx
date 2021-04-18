import React from "react";
import { StyleSheet, View, Share } from "react-native";
import { Button, Dialog, Subheading } from "react-native-paper";
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from "react-native-vector-icons/Ionicons";
import { snackbar } from "../../utils/snackbar";

interface Props {
    visible: boolean,
    tripId: string,
    onDismiss(): void
}

export const DialogTripCreated = React.memo((props: Props) => {

    const onShare = () => {
        Share.share({
            message: `Hey, join my trip using trip id- ${props.tripId}`,
            title: "Share your trip id with friends."
        })
        .then(value => {
            console.log(value.action);
        })
        .catch(err => {
            console.error(err.message);
        })
        props.onDismiss();
    }
    const onCopy = () => {
        Clipboard.setString(props.tripId);
        snackbar.show({
            message: "trip id copied successfully",
            type: 'success'
        });
        props.onDismiss();
    }

    return (
        <Dialog
            visible={props.visible}
            onDismiss={props.onDismiss}
            dismissable={false}>
            <Dialog.Content
                style={styles.common}>
                <View
                    style={[styles.common, styles.iconContainer]}>
                    <Icon name="checkmark-outline" size={24} color="#fff" />
                </View>
                <Subheading style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}>
                    Trip created successfully, Share trip id with friends.
                </Subheading>
                <Subheading style={{ color: "green", marginBottom: 16 }} selectable>
                    {props.tripId}
                </Subheading>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    onPress={onCopy}
                    color="gray">
                    copy
                </Button>
                <Button
                    onPress={onShare}
                    color="#1B98F5">
                    share
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
});

const styles = StyleSheet.create({
    common: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        padding: 12, borderRadius: 200,
        backgroundColor: '#1B98F5', marginBottom: 16
    }
});