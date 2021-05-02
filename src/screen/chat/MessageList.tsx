import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Avatar, Caption, Subheading } from 'react-native-paper';
import { IMessage } from '../../service/service.message';

interface ItemProps {
    message: IMessage
}

const ListItem = React.memo((props: ItemProps) => {
    return (
        <View
            style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: props.message.isMe ? "flex-end" : 'flex-start' }}>
            {
                !props.message.isMe
                &&
                <Avatar.Image
                    size={36}
                    style={{ marginRight: 5 }}
                    source={{ uri: props.message.sender.photo }} />
            }
            <View
                style={props.message.isMe ? styles.me : styles.notMe}>
                {
                    !props.message.isMe
                    &&
                    <Caption>
                        {props.message.sender.name}
                    </Caption>
                }
                <Subheading
                    style={{ color: '#000' }}
                    lineBreakMode='tail'>
                    {props.message.message}
                </Subheading>
            </View>
        </View>
    );
});

interface Props {
    messages: IMessage[]
}

export const MessageList = (props: Props) => {
    return (
        <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
            data={props.messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (<ListItem message={item} />)}
            inverted={true} />
    );
}

const styles = StyleSheet.create({
    me: {
        padding: 5,
        backgroundColor: '#1B98F520',
        borderRadius: 8,
        maxWidth: "90%",
        alignSelf: 'flex-end',
        marginVertical: 3
    },
    notMe: {
        padding: 5,
        backgroundColor: '#0D0D0D20',
        borderRadius: 8,
        maxWidth: "90%",
        alignSelf: 'flex-start',
        marginVertical: 3
    }
});