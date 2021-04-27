import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const Loading = React.memo(() => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#1B98F5" />
    </View>
));