import React from 'react';
import ScreenContainer from '../../common/ScreenContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import { Subheading } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import ChatAction from './ChatAction';
import { AppScreens, NavigationProps } from '../../navigation/navigation.types';

interface Props extends NavigationProps<AppScreens.GROUP_CHAT> {
    //
}

const ScreenGroupChat = React.memo((props: Props) => {
    const navigation = props.navigation;
    const { title } = props.route.params;
    return (
        <ScreenContainer
            title={title}
            subTitle="member 1, member 2, member 3"
            showBack={navigation.goBack}>
            <View style={styles.container}>
                <View
                    style={styles.emptyContainer}>
                    <Icon name="chatbubbles-outline" size={84} color="#CAD5E2" />
                    <Subheading
                        style={styles.emptyMessage}>
                        Start conversation to see here
                        </Subheading>
                </View>
                <ChatAction />
            </View>
        </ScreenContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%', flex: 1
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