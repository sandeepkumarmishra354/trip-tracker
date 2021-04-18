import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { AppNavigator } from './navigation/navigation.home';
import { AppStackNavigatorAuth } from './navigation/navigation.auth';
import { StatusBar } from 'react-native';
import { useRootStore } from './common/RootStoreProvider';
import MySnackbar from './common/MySnackbar';
import { snackbarRef } from './utils/snackbar';

function TripTracker() {
    const { authenticated } = useRootStore().storeAuth;
    const primaryDark = "#F8F8FF";
    return (
        <NavigationContainer>
            <StatusBar
                translucent={!authenticated}
                backgroundColor={authenticated ? primaryDark : "transparent"}
                barStyle="dark-content" />
            {
                authenticated
                    ?
                    <AppNavigator />
                    :
                    <AppStackNavigatorAuth />
            }
            <MySnackbar ref={snackbarRef} />
        </NavigationContainer>
    );
};

export default observer(TripTracker);