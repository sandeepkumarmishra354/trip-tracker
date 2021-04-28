import React from 'react';
import { FAB } from 'react-native-paper';

interface Props {
    onFabPress(): void
}

export const OngoingTripMapView = (props:Props) => {
    return (
        <FAB
            style={{ position: 'absolute', bottom: 16, right: 16 }}
            icon="chatbubble-outline"
            small={false}
            onPress={props.onFabPress} />
    );
}