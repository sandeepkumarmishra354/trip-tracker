import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";
import { FAB, Subheading } from "react-native-paper";
import { useRootStore } from "../../common/RootStoreProvider";

interface Props {
    onFabPress(): void
}

export const HomeOngoingTrip = observer((props: Props) => {

    const storeTrip = useRootStore().storeTrip;

    return (
        <View style={{ width: "100%", flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 }}>
            <Subheading>
                {JSON.stringify(storeTrip.joinedTrip ?? {},undefined,4)}
            </Subheading>
            <FAB
                style={{ position: 'absolute', bottom: 16, right: 16 }}
                icon="chatbubble-outline"
                small={false}
                onPress={props.onFabPress} />
        </View>
    );
});