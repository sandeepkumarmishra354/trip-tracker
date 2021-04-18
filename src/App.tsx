import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppTheme } from './utils/theme';
import { RootStoreProvider } from './common/RootStoreProvider';
import { serviceStorage } from './service/service.storage';
import ScreenOnboarding from './screen/onboarding/ScreenOnboarding';
import { View } from 'react-native';

type State = {
    TripTracker: any,
    isFirstTime: boolean | null
}

const Loader = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
    </View>
);

const MyContainer = ({ children }: { children: React.ReactNode }) => (
    <PaperProvider
        settings={{ icon: props => <IonIcon {...props} /> }}
        theme={AppTheme}>
        {children}
    </PaperProvider>
);

export default function App() {

    const [state, setState] = useState<State>({
        TripTracker: null,
        isFirstTime: null
    });

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const [isFirstTime, module] = await Promise.all([
            serviceStorage.isFirstTime(),
            import('./TripTracker')
        ]);
        setState({ isFirstTime, TripTracker: module.default });
    }

    const onDone = async () => {
        serviceStorage.setAppAsOpened()
            .then(() => { })
            .catch(() => { });
        setState({ ...state, isFirstTime: false });
    }

    const { TripTracker, isFirstTime } = state;

    if (isFirstTime === null)
        return <Loader />;

    if (isFirstTime === true)
        return (
            <MyContainer>
                <ScreenOnboarding onDone={onDone} />
            </MyContainer>
        );

    return (
        <MyContainer>
            <RootStoreProvider>
                <TripTracker />
            </RootStoreProvider>
        </MyContainer>
    );

};