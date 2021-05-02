import React from 'react';
import ScreenHome from '../screen/home/ScreenHome';
import ScreenGroupChat from '../screen/chat/ScreenChat';
import ScreenProfile from '../screen/profile/ScreenProfile';
import { AppScreens, AppStackParams } from './navigation.types';
import ScreenCreateTrip from '../screen/trip/ScreenCreateTrip';
import ScreenProfileEdit from '../screen/profile/ScreenProfileEdit';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { ScreenOngoingTrip } from '../screen/trip/ScreenOngoingTrip';

const AppStack = createNativeStackNavigator<AppStackParams>();

export const AppNavigator = React.memo(() => (
    <AppStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={AppScreens.HOME}>
        <AppStack.Screen name={AppScreens.HOME} component={ScreenHome} />
        <AppStack.Screen name={AppScreens.PROFILE} component={ScreenProfile} />
        <AppStack.Screen name={AppScreens.PROFILE_EDIT} component={ScreenProfileEdit} />
        <AppStack.Screen name={AppScreens.CREATE_TRIP} component={ScreenCreateTrip} />
        <AppStack.Screen name={AppScreens.GROUP_CHAT} component={ScreenGroupChat} />
        <AppStack.Screen name={AppScreens.TRIP_ONGOING} component={ScreenOngoingTrip} />
    </AppStack.Navigator>
));