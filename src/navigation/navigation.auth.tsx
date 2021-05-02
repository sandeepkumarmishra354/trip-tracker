import React from 'react';
import ScreenLogin from '../screen/auth/ScreenLogin';
import { AppAuthScreens, AppAuthStackParams } from './navigation.types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const AppAuthStack = createNativeStackNavigator<AppAuthStackParams>();

export const AppStackNavigatorAuth = React.memo(() => (
    <AppAuthStack.Navigator
        screenOptions={{ headerShown: false }}>
        <AppAuthStack.Screen name={AppAuthScreens.LOGIN} component={ScreenLogin} />
    </AppAuthStack.Navigator>
));