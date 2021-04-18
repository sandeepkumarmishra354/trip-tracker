import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Caption } from 'react-native-paper';

interface Props {
    style?: StyleProp<ViewStyle>,
    text: string
}

const LineWithText = React.memo((props: Props) => {
    const lineColor = "#CAD5E2";
    return (
        <View style={[styles.container, props.style]}>
            <View style={{ width: '45%', height: 0.5, backgroundColor: lineColor }} />
            <View
                style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: lineColor, borderRadius: 100 }}>
                <Caption style={{ margin: 5 }}>{props.text}</Caption>
            </View>
            <View style={{ width: '45%', height: 0.5, backgroundColor: lineColor }} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%', flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center'
    }
});

export default LineWithText;