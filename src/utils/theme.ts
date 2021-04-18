import { DefaultTheme } from "react-native-paper";

declare global {
    namespace ReactNativePaper {
        interface ThemeColors {
            appbarItemColor: string,
            iconColor: string,
            pageBackground: string,
            primaryDark: string,
            accent: string
        }
    }
}

export const AppTheme: ReactNativePaper.Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#fff",
        primaryDark: "#fff",
        accent: '#1B98F5',
        background: '#fff',
        surface: '#fff',
        text: '#2F363F',
        //custom colors
        appbarItemColor: '#EAF0F1',
        iconColor: '#BDBDBD',
        pageBackground: '#fff',
    }
}