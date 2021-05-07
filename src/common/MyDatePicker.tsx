import React, { useState } from "react";
import DateTimePicker, { Event as DateEvent } from '@react-native-community/datetimepicker';
import { StyleProp, StyleSheet, TouchableNativeFeedback, View, ViewStyle } from "react-native";
import { Caption } from "react-native-paper";

interface Props {
    value?: Date,
    minDate?: Date,
    maxDate?: Date,
    onChange?: (newDate: Date) => void,
    onTouch(): void,
    onDismiss(): void,
    show: boolean,
    style?: StyleProp<ViewStyle>
}

export const MyDatePicker = React.memo((props: Props) => {
    const { onChange, onDismiss, value, show, minDate, maxDate } = props;
    const [currentDate, setCurrentDate] = useState<Date | undefined>(value);
    const dateStr = currentDate?.toDateString() ?? "-- / -- / --";

    const _onChange = (event: DateEvent, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setCurrentDate(selectedDate);
            onChange?.(selectedDate);
        } else {
            onDismiss();
        }
    }

    return (
        <>
            <Caption
                style={{ color: "#758283", fontSize: 15, marginBottom: 8 }}>
                Select end date *
            </Caption>
            <TouchableNativeFeedback onPress={props.onTouch}>
                <View style={[styles.container, props.style]}>
                    <Caption style={{ color: "#000", fontSize: 15, marginBottom: 8 }}>
                        {dateStr}
                    </Caption>
                    {show &&
                        <DateTimePicker
                            value={currentDate ?? new Date()}
                            mode='date'
                            is24Hour={false}
                            display='spinner'
                            onChange={_onChange}
                            minimumDate={minDate}
                            maximumDate={maxDate}/>
                    }
                </View>
            </TouchableNativeFeedback>
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        height: 45, width: "100%",
        backgroundColor: '#ecf3f9', paddingLeft: 16,
        borderRadius: 5, justifyContent: 'center'
    }
});