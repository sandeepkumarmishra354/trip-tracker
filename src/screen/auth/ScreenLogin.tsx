import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, Image } from 'react-native';
import { Title } from 'react-native-paper';
import { Easing } from 'react-native-reanimated';
import LineWithText from '../../common/LineWithText';
import MyButton from '../../common/MyButton';
import { useRootStore } from '../../common/RootStoreProvider';
import { AppAuthScreens, NavigationAuthProps } from '../../navigation/navigation.types';
import { LoginMethod } from '../../service/service.auth';
import { PhoneAuthView } from './PhoneAuthView';

interface Props extends NavigationAuthProps<AppAuthScreens.LOGIN> {
    //
}

function ScreenLogin(props: Props) {

    const animeActionContainerValue: Animated.Value = useRef(new Animated.Value(1000)).current;
    const storeAuth = useRootStore().storeAuth;
    const { authenticating, loginVia } = storeAuth;

    useEffect(() => {
        Animated.timing(animeActionContainerValue, {
            toValue: 0,
            duration: 800,
            easing: Easing.elastic(0.7),
            useNativeDriver: true,
        }).start();
    }, [])

    function loginGoogle() {
        doLogin('google');
    }
    function loginFacebook() {
        doLogin('facebook');
    }
    function loginPhone() {
        doLogin('phone');
    }
    function doLogin(method: LoginMethod) {
        storeAuth.login(method);
    }

    return (
        <View
            style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Title
                    style={styles.actionTitle}>
                    Start tracking your trip
                    </Title>
                <Image
                    style={{
                        width: "100%", height: "50%",
                        resizeMode: 'contain', marginTop: 45
                    }}
                    source={require('../../assets/images/login_img.png')} />
            </View>
            <Animated.View
                style={[
                    styles.actionContainer,
                    { transform: [{ translateY: animeActionContainerValue }] }
                ]}>
                <MyButton
                    label="login with google"
                    color='#db4a39'
                    borderRadius={4}
                    //elevation={1}
                    style={{ width: '85%',marginBottom:16 }}
                    icon="logo-google"
                    loading={loginVia === 'google'}
                    disabled={authenticating}
                    onPress={loginGoogle} />
                <MyButton
                    label="Login With Facebook"
                    color="#3b5998"
                    borderRadius={2}
                    elevation={1}
                    style={{ width: '85%' }}
                    icon="logo-facebook"
                    onPress={loginFacebook}
                    loading={loginVia === 'facebook'}
                    disabled={authenticating} />
                <LineWithText
                    style={{ paddingVertical: 14, width: '85%' }}
                    text="OR" />
                <MyButton
                    label="Login With Phone"
                    color="#1B98F5"
                    borderRadius={4}
                    //elevation={1}
                    style={{ width: '85%' }}
                    icon="call-outline"
                    onPress={loginPhone}
                    loading={loginVia === 'phone'}
                    disabled={authenticating} />
            </Animated.View>
            <PhoneAuthView show={storeAuth.showPhoneAuth} />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%', height: '90%',
        resizeMode: 'contain'
    },
    actionContainer: {
        width: '100%', alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20, backgroundColor: '#ffffff',
        paddingTop: 22,
        //borderTopLeftRadius: 12, borderTopRightRadius: 12,
        elevation: 12,
    },
    actionTitle: {
        color: '#645c64', fontSize: 18,
        fontWeight: 'normal', position: 'absolute',
        top: 64
    }
});

export default observer(ScreenLogin);