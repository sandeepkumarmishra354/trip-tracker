import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScreenLogin from '../screen/auth/ScreenLogin';
import { AppAuthScreens, AppAuthStackParams } from './navigation.types';

const AppAuthStack = createStackNavigator<AppAuthStackParams>();

export const AppStackNavigatorAuth = React.memo(() => (
    <AppAuthStack.Navigator
        headerMode='none'
        /*screenOptions={{
            ...TransitionPresets.SlideFromRightIOS
        }}*/>
        <AppAuthStack.Screen name={AppAuthScreens.LOGIN} component={ScreenLogin} />
    </AppAuthStack.Navigator>
));