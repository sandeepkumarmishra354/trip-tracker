import React from 'react';
import { AppDataStore } from '../data-store/app.store';

interface IAppStore {
    rootStore?: AppDataStore
}
const appStore: IAppStore = {
    //
}

const StoreContext = React.createContext<AppDataStore | undefined>(undefined);

export const RootStoreProvider = ({ children }: { children: React.ReactNode }) => {
    appStore.rootStore = appStore.rootStore ?? new AppDataStore();
    return (
        <StoreContext.Provider value={appStore.rootStore}>
            {children}
        </StoreContext.Provider>
    );
}

export const useRootStore = () => {
    const context = React.useContext(StoreContext);
    if(context === undefined)
        throw new Error("useRootStore must be used within a RootStoreProvider.");
    return context;
}