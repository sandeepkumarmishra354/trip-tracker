import React from 'react';
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
    return (
        <ScreenContainer
            title="Group chat"
            showBack={navigation.goBack}>
            <View style={styles.container}>
                <View
                    style={{ width: '100%', flexGrow: 1 }}>
                    {
                        storeMessage.loadingMessage
                            ?
                            <Loading />
                            :
                            (storeMessage.messages === null || storeMessage.messages.length === 0)
                                ?
                                <NoMessageView />
                                :
                                <MessageList messages={storeMessage.messages} />
                    }
                </View>
                {!storeMessage.loadingMessage && <ChatAction />}
            </View>
        </ScreenContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%', flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    emptyContainer: {
        flexGrow: 1, justifyContent: 'center',
        alignItems: 'center'
    },
    emptyMessage: {
        marginHorizontal: 22, textAlign: 'center',
        marginTop: 18
    },
});

export default ScreenGroupChat;