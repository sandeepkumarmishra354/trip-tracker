import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { enableScreens } from 'react-native-screens';

enableScreens(true);

export enum AppAuthScreens {
    LOGIN = 'login',
}
export type AppAuthStackParams = {
    [AppAuthScreens.LOGIN]: undefined,
}
export interface NavigationAuthProps<S extends AppAuthScreens> {
    navigation: StackNavigationProp<AppAuthStackParams, S>,
    route: RouteProp<AppAuthStackParams, S>,
}
////////////////////////////////////////////////////////
export enum AppScreens {
    HOME = 'home',
    GROUP_CHAT = 'group-chat',
    PROFILE = 'profile',
    PROFILE_EDIT = 'profile-edit',
    CREATE_TRIP = "create-trip"
}
export type AppStackParams = {
    [AppScreens.HOME]: undefined,
    [AppScreens.PROFILE]: undefined,
    [AppScreens.PROFILE_EDIT]: undefined,
    [AppScreens.CREATE_TRIP]: undefined,
    [AppScreens.GROUP_CHAT]: { title: string },
}
export interface NavigationProps<S extends AppScreens> {
    navigation: StackNavigationProp<AppStackParams, S>,
    route: RouteProp<AppStackParams, S>,
}