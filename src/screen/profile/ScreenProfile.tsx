import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import MyButton from '../../common/MyButton';
import MyDivider from '../../common/MyDivider';
import { useRootStore } from '../../common/RootStoreProvider';
import ScreenContainer from '../../common/ScreenContainer';
import { temp_image } from '../../data-store/store/store.auth';
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
    const onHelpPress = () => {
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
            <Menu.Item
                title="Help"
                onPress={onHelpPress} />
        </Menu>
    );
});

interface Props extends NavigationProps<AppScreens.PROFILE> {
    storeProfile: StoreProfile
}

const ScreenProfile = (props: Props) => {

    const { loggingOut, user, logout } = useRootStore().storeProfile;
    const navigation = props.navigation;

    const openScreen = (screen: AppScreens) => {
        navigation.navigate(screen);
    }

    return (
        <ScreenContainer
            title="Profile"
            showBack={navigation.goBack}
            actions={[<ActionMenu key="1" openScreen={openScreen} />]}>
            <ScrollView
                style={{ width: '100%' }}>
                <ProfileHeader
                    email={user?.email ?? "example@email.com"}
                    photo={user?.photoURL ?? temp_image}
                    name={user?.displayName ?? "Display Name"} />
                <MyDivider height={22} />
                <ProfileOption />
                <MyButton
                    style={{ width: '70%', alignSelf: 'center', marginVertical: 28 }}
                    borderRadius={2}
                    label="logout"
                    icon="log-out-outline"
                    color="#E83A59"
                    loading={loggingOut}
                    disabled={loggingOut}
                    onPress={logout} />
            </ScrollView>
        </ScreenContainer>
    );
}

export default observer(ScreenProfile);