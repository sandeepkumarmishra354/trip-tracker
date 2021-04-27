import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { TouchableNativeFeedback } from "react-native";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { useRootStore } from "../../common/RootStoreProvider";

interface Props {
    onPress(): void
}

export const UserHeaderImage = observer((props: Props) => {
    const storeProfile = useRootStore().storeProfile;

    useEffect(() => {
        storeProfile.fetchProfile()
            .then(() => { })
            .catch(() => { });
    }, []);

    return (
        <TouchableNativeFeedback
            onPress={props.onPress}>
            {
                storeProfile.fetching
                    ?
                    <ActivityIndicator
                        style={{ marginRight: 5 }}
                        color="#1B98F5" size={16} />
                    :

                    <Avatar.Image
                        style={{
                            backgroundColor: "#F8F8FF", marginRight: 8,
                            borderWidth: 0.5, borderColor: '#ecf3f9'
                        }}
                        size={32}
                        source={{ uri: storeProfile.profileData.photo }} />
            }
        </TouchableNativeFeedback>
    );
});