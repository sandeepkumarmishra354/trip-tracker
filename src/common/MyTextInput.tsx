import React, { useState } from "react";
import { KeyboardTypeOptions, StyleProp, StyleSheet, TextInput, TextStyle } from "react-native";
import { Caption } from "react-native-paper";

interface Props {
    style?: StyleProp<TextStyle>,
    value?: string,
    onChangeText?: (value: string) => void,
    placeholder?: string,
    type?: KeyboardTypeOptions,
    label?: string,
    disabled?: boolean
}

export const MyTextInput = React.memo((props: Props) => {

    const [isFocused, setFocus] = useState(false);

    const onFocus = () => {
        setFocus(true);
    }
    const onBlur = () => {
        setFocus(false);
    }

    return (
        <>
            {props.label && <Caption
            style={{ color: "#758283", fontSize: 15,marginBottom:8 }}>
                {props.label}
            </Caption>}
            <TextInput
                style={[styles.input, props.style, isFocused ? {
                    borderColor: '#1B98F5',
                    borderWidth: 0.5
                } : undefined]}
                underlineColorAndroid="transparent"
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardType={props.type}
                editable={!props.disabled}/>
        </>
    );
});

const styles = StyleSheet.create({
    input: {
        height: 40, width: "100%",
        backgroundColor: '#ecf3f9', paddingLeft: 8,
        borderRadius: 5
    }
});