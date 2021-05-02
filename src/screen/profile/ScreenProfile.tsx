import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { Loading } from '../../common/Loading';
import MyButton from '../../common/MyButton';
import MyDivider from '../../common/MyDivider';
import { useRootStore } from '../../common/RootStoreProvider';
import ScreenContainer from '../../common/ScreenContainer';
import { StoreProfile } from '../../data-store/store/store.profile';
import { AppScreens, NavigationProps } from '../../navigation/navigation.types';
import ProfileHeader from './ProfileHeader';
import ProfileOption from './ProfileOption';

interface IActionProps {
    openScreen(screen: AppScreens): void
}

const ActionMenu = React.memo((props: IActionProps) => {
    const [show, setShow] = useState(false);

    const showMenu = () => {
        setShow(true);
    }
    const dismissMenu = () => {
        setShow(false);
    }
    const onEditPress = () => {
        props.openScreen(AppScreens.PROFILE_EDIT);
        setShow(false);
    }

    return (
        <Menu
            visible={show}
            onDismiss={dismissMenu}
            anchor={<Appbar.Action
                icon="ellipsis-vertical-outline"
                onPress={showMenu} />}>
            <Menu.Item
                title="Edit"
                onPress={onEditPress} />
        </Menu>
    );
});

interface Props extends NavigationProps<AppScreens.PROFILE> {
    storeProfile: StoreProfile
}

const ScreenProfile = (props: Props) => {

    const storeProfile = useRootStore().storeProfile;
    const navigation = props.navigation;

    const openScreen = (screen: AppScreens) => {
        navigation.navigate(screen);
    }
    const openOngoing = () => {
        navigation.navigate(AppScreens.TRIP_ONGOING);
    }

    return (
        <ScreenContainer
            title="Profile"
            showBack={navigation.goBack}>
            {storeProfile.fetching
                ? <Loading />
                :
                storeProfile.profileData && <View
                    style={{ width: '100%',flex:1 }}>
                    <ProfileHeader
                        email={storeProfile.profileData.email}
                        photo={storeProfile.profileData.photo}
                        name={storeProfile.profileData.fullname} />
                    <MyDivider height={22} />
                    <ProfileOption openOngoingTrip={openOngoing}/>
                    <MyButton
                        style={{ width: '70%', alignSelf: 'center', marginVertical: 28,position:'absolute',bottom:16 }}
                        borderRadius={2}
                        label="logout"
                        icon="log-out-outline"
                        color="#E83A59"
                        loading={storeProfile.loggingOut}
                        disabled={storeProfile.loggingOut}
                        onPress={storeProfile.logout} />
                </View>
            }
        </ScreenContainer>
    );
}

export default observer(ScreenProfile);