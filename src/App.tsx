import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppTheme } from './utils/theme';
import { RootStoreProvider } from './common/RootStoreProvider';
import { serviceStorage } from './service/service.storage';
import ScreenOnboarding from './screen/onboarding/ScreenOnboarding';
import { API } from './service/api';
import { Loading } from './common/Loading';

type State = {
    TripTracker: any,
    isFirstTime: boolean | null
}

const MyContainer = ({ children }: { children: React.ReactNode }) => (
    <PaperProvider
        settings={{ icon: props => <IonIcon {...props} /> }}
        theme={AppTheme}>
        {children}
    </PaperProvider>
);

const App = () => {

    const [state, setState] = useState<State>({
        TripTracker: null,
        isFirstTime: null
    });

    useEffect(() => {
        load();
        // it's important to call this method here once
       API.setupParseInstallation();
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
        return <Loading />;

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

export default App;