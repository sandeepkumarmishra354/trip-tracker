import React, { useEffect } from 'react';
import HomeNoTrip from './HomeNoTrip';
import ScreenContainer from '../../common/ScreenContainer'
import { AppScreens, NavigationProps } from '../../navigation/navigation.types';
import { UserHeaderImage } from './UserHeaderImage';
import { useRootStore } from '../../common/RootStoreProvider';
import { Loading } from '../../common/Loading';
import { HomeOngoingTrip } from './HomeOngoingTrip';
import { observer } from 'mobx-react-lite';
//import { FAB } from 'react-native-paper';

const ScreenHome = (props: NavigationProps<AppScreens.HOME>) => {

    const storeTrip = useRootStore().storeTrip;
    const navigation = props.navigation;

    useEffect(() => {
        storeTrip.checkForJoinedTrip()
            .then(() => { })
            .catch(() => { })
    }, []);

    const onCreateTripPress = () => {
        navigation.navigate(AppScreens.CREATE_TRIP);
    }
    const openProfile = () => {
        navigation.navigate(AppScreens.PROFILE);
    }
    const onFabPress = () => {
        navigation.navigate(AppScreens.GROUP_CHAT);
    }

    return (
        <ScreenContainer
            title="Trip Tracker"
            elevation={1}
            actions={[<UserHeaderImage key="1" onPress={openProfile} />]}>
            {
                storeTrip.checkingJoinedTrip
                    ?
                    <Loading />
                    :
                    storeTrip.hasOngoingTrip
                        ?
                        <HomeOngoingTrip onFabPress={onFabPress} />
                        :
                        <HomeNoTrip onCreateTrip={onCreateTripPress} />
            }
        </ScreenContainer>
    );
}

export default observer(ScreenHome);