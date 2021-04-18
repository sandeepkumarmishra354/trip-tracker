import { observer } from 'mobx-react-lite';
import React from 'react';
import { TouchableNativeFeedback, View } from 'react-native';
import { Avatar, FAB } from 'react-native-paper';
import HomeNoTrip from './HomeNoTrip';
import { useRootStore } from '../../common/RootStoreProvider';
import ScreenContainer from '../../common/ScreenContainer'
import { AppScreens, NavigationProps } from '../../navigation/navigation.types';
import { temp_image } from '../../data-store/store/store.auth';

const UserImage = observer(({ onPress }: { onPress(): void }) => {
    const storeAuth = useRootStore().storeAuth;
    return (
        <TouchableNativeFeedback
            onPress={onPress}>
            <Avatar.Image
                style={{
                    backgroundColor: "#F8F8FF", marginRight: 15,
                    borderWidth: 0.5, borderColor: '#ecf3f9'
                }}
                size={32}
                source={{ uri: storeAuth.user?.photoURL ?? temp_image }} />
        </TouchableNativeFeedback>
    );
});

const ScreenHome = (props: NavigationProps<AppScreens.HOME>) => {

    const navigation = props.navigation;

    const onCreateTripPress = () => {
        navigation.navigate(AppScreens.CREATE_TRIP);
    }
    const profilePress = () => {
        navigation.navigate(AppScreens.PROFILE);
    }
    const onFabPress = () => {
        navigation.navigate(AppScreens.GROUP_CHAT, { title: 'Group chat' });
    }

    return (
        <ScreenContainer
            title="Trip Tracker"
            elevation={1}
            actions={[<UserImage key="1" onPress={profilePress} />]}>
            <View
                style={{
                    flex: 1, width: '100%', justifyContent: 'center',
                    alignItems: 'center', paddingHorizontal: 8
                }}>
                <HomeNoTrip onCreateTrip={onCreateTripPress} />
            </View>
            {/*<FAB
                style={{ position: 'absolute', bottom: 16, right: 16 }}
                icon="chatbubble-outline"
                small={false}
                onPress={onFabPress} />*/}
        </ScreenContainer>
    );
}

export default ScreenHome;