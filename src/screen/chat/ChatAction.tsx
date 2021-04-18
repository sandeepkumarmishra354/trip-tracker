import React, { useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native';
import { IconButton, List } from 'react-native-paper';
import MyActionSheet from '../../common/MyActionSheet';
import MyDivider from '../../common/MyDivider';

const ChatAction = React.memo(() => {

    const actionSheet = useRef<MyActionSheet>(null);
    const [message, setMessage] = useState("");

    function onSendClick() {
        if (message)
            setMessage("");
    }
    function onImageClick() {
        actionSheet.current?.show();
    }
    function onImageOption() {
        actionSheet.current?.hide();
    }
    function onMessageChange(text: string) {
        if (message !== text) {
            setMessage(text);
        }
    }

    return (
        <>
            <View style={styles.actionContainer}>
                <IconButton
                    icon="image-outline"
                    onPress={onImageClick}
                    color="#758283" />
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
            <MyActionSheet ref={actionSheet}>
                <List.Item
                    title="Open Gallery"
                    onPress={onImageOption}
                    left={props => <List.Icon {...props} icon="images-outline" />} />
                <MyDivider/>
                <List.Item
                    title="Open Camera"
                    onPress={onImageOption}
                    left={props => <List.Icon {...props} icon="camera-outline" />} />
            </MyActionSheet>
        </>
    );
});

const styles = StyleSheet.create({
    actionContainer: {
        position: 'absolute', bottom: 0,
        backgroundColor: '#fff', width: '100%',
        borderRadius: 0, elevation: 8,
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 3
    },
    input: {
        height: 40, flex: 1,
        borderRadius: 16, backgroundColor: '#ecf3f9',
        paddingLeft: 8
    }
});

export default ChatAction;