import React from 'react';
//import { createStackNavigator } from '@react-navigation/stack';
import ScreenHome from '../screen/home/ScreenHome';
import ScreenGroupChat from '../screen/chat/ScreenChat';
import ScreenProfile from '../screen/profile/ScreenProfile';
import { AppScreens, AppStackParams } from './navigation.types';
import ScreenCreateTrip from '../screen/trip/ScreenCreateTrip';
import ScreenProfileEdit from '../screen/profile/ScreenProfileEdit';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

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
    </AppStack.Navigator>
));