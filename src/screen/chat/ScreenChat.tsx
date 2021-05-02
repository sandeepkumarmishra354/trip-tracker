import React, { useEffect } from 'react';
import ScreenContainer from '../../common/ScreenContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import { Subheading } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import ChatAction from './ChatAction';
import { AppScreens, NavigationProps } from '../../navigation/navigation.types';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../common/RootStoreProvider';
import { Loading } from '../../common/Loading';
import { MessageList } from './MessageList';

const NoMessageView = React.memo(() => (
    <View
        style={styles.emptyContainer}>
        <Icon name="chatbubbles-outline" size={84} color="#CAD5E2" />
        <Subheading
            style={styles.emptyMessage}>
            Start conversation to see here
        </Subheading>
    </View>
));

interface Props extends NavigationProps<AppScreens.GROUP_CHAT> {
    //
}

const ScreenGroupChat = observer((props: Props) => {

    const storeMessage = useRootStore().storeMessage;
    const navigation = props.navigation;


    useEffect(() => {
        storeMessage.resetUnreadMessages();
        storeMessage.loadAll()
            .then(() => { })
            .catch(() => { });
    }, []);

    if (storeMessage.loadingMessage)
        return <Loading />;
    if (storeMessage.messages === null || storeMessage.messages.length === 0)
        return (
            <ScreenContainer
                title="Group chat"
                showBack={navigation.goBack}>
                <View
                    style={styles.container}>
                    <NoMessageView />
                    <ChatAction />
                </View>
            </ScreenContainer>
        );

    return (
        <ScreenContainer
            title="Group chat"
            showBack={navigation.goBack}>
            <View style={styles.container}>
                <View
                    style={[styles.messageList, { marginTop: 56 }]}>
                    <MessageList messages={storeMessage.messages} />
                </View>
                <ChatAction />
            </View>
        </ScreenContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%', flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyMessage: {
        marginHorizontal: 22,
        textAlign: 'center',
        marginTop: 18
    },
    messageList: {
        width: '100%',
    }
});

export default ScreenGroupChat;