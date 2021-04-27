import React, { useEffect, createRef, useRef } from 'react';
import { observer } from "mobx-react-lite";
import MyActionSheet from '../../common/MyActionSheet';
import { StyleSheet, View } from 'react-native';
import { MyTextInput } from '../../common/MyTextInput';
import MyButton from '../../common/MyButton';
import { useRootStore } from '../../common/RootStoreProvider';

interface Props {
    show: boolean
}

export const PhoneAuthView = observer((props: Props) => {
    const { setShowPhoneAuth, sendOtp, verifyOtp, otpSent, sendingVerifyingOtp } = useRootStore().storeAuth;
    const actionSheetRef = createRef<MyActionSheet>();
    const phoneNumber = useRef("");
    const otp = useRef("");

    useEffect(() => {
        if (props.show) {
            actionSheetRef.current?.show();
        } else {
            actionSheetRef.current?.hide();
        }
    }, [props.show]);

    const onPhoneChange = (text: string) => {
        phoneNumber.current = text;
    }
    const onOtpChange = (text: string) => {
        otp.current = text;
    }
    const onSendOtp = () => {
        if(phoneNumber.current)
            sendOtp(phoneNumber.current)
                .then(() => { })
                .catch(() => { });
    }
    const onVerifyOtp = () => {
        if(otp.current)
            verifyOtp(otp.current)
                .then(() => { })
                .catch(() => { });
    }
    const onCancel = () => {
        setShowPhoneAuth(false);
    }

    return (
        <MyActionSheet
            ref={actionSheetRef}
            dismissOnBack={false}
            dismissOnTouch={false}>
            <View style={styles.container}>
                <MyTextInput
                    style={{ height: 45 }}
                    placeholder={otpSent ? "enter otp" : "phone number"}
                    type="phone-pad"
                    onChangeText={otpSent ? onOtpChange : onPhoneChange} />
                <View style={styles.buttonContainer}>
                    {!otpSent && <MyButton
                        label="cancel"
                        color="#758283"
                        onPress={onCancel}
                        borderRadius={3} />}
                    <MyButton
                        label={otpSent ? "verify otp" : "send otp"}
                        onPress={otpSent ? onVerifyOtp : onSendOtp}
                        loading={sendingVerifyingOtp}
                        disabled={sendingVerifyingOtp}
                        borderRadius={3} />
                </View>
            </View>
        </MyActionSheet>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%', justifyContent: 'center',
        alignItems: 'center', paddingHorizontal: 32,
        paddingVertical: 16
    },
    buttonContainer: {
        marginTop: 22, flexDirection: 'row', width: "100%",
        alignItems: 'center', justifyContent: 'space-evenly'
    }
});