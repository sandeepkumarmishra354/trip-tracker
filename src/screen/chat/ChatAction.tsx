import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native';
import { IconButton, List } from 'react-native-paper';
import MyActionSheet from '../../common/MyActionSheet';
import MyDivider from '../../common/MyDivider';
import { useRootStore } from '../../common/RootStoreProvider';

const ChatAction = observer(() => {

    const storeMessage = useRootStore().storeMessage;
    const actionSheet = useRef<MyActionSheet>(null);
    const [message, setMessage] = useState("");

    function onSendClick() {
        const trimmedMessage = message.trim();
        if (trimmedMessage) {
            storeMessage.sendText(trimmedMessage)
                .then(() => { })
                .catch(() => { });
            setMessage("");
        }
    }
    /*function onImageClick() {
        actionSheet.current?.show();
    }
    function onImageOption() {
        actionSheet.current?.hide();
    }*/
    function onMessageChange(text: string) {
        if (message !== text) {
            setMessage(text);
        }
    }

    return (
        <>
            <View style={styles.actionContainer}>
                {/*<IconButton
                    icon="image-outline"
                    onPress={onImageClick}
                    color="#758283" />*/}
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Type here..."
                    value={message}
                    onChangeText={onMessageChange} />
                <IconButton
                    icon="send-outline"
                    onPress={onSendClick}
                    color="#1B98F5" />
            </View>
            {/*<MyActionSheet ref={actionSheet}>
                <List.Item
                    title="Open Gallery"
                    onPress={onImageOption}
                    left={props => <List.Icon {...props} icon="images-outline" />} />
                <MyDivider />
                <List.Item
                    title="Open Camera"
                    onPress={onImageOption}
                    left={props => <List.Icon {...props} icon="camera-outline" />} />
            </MyActionSheet>*/}
        </>
    );
});

const styles = StyleSheet.create({
    actionContainer: {
        backgroundColor: '#fff', width: '100%',
        borderRadius: 0, elevation: 8,
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 3
    },
    input: {
        height: 40, flex: 1,
        borderRadius: 16, backgroundColor: '#ecf3f9',
        paddingLeft: 8,marginLeft:5
    }
});

export default ChatAction;