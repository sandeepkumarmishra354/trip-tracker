import React, { useRef } from 'react'
import { Image, StatusBar, StyleSheet, View, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Subheading, Title } from 'react-native-paper';

const DEVICE_WIDTH = Dimensions.get('screen').width;

interface ItemProps {
    image: any,
    title: string,
    description: string,
    onNext?: () => void,
    onDone?: () => void,
    showDone?: boolean
}

const OnboardItem = React.memo((props: ItemProps) => (
    <View
        style={styles.itemContainer}>
        <Image
            style={styles.image}
            source={props.image} />
        <Title style={{ marginTop: 16 }}>
            {props.title}
        </Title>
        <Subheading
            style={styles.description}>
            {props.description}
        </Subheading>
        <Button
            style={[styles.button, { backgroundColor: props.showDone ? "#37374F" : "#758283", position: 'absolute', bottom: 16 }]}
            labelStyle={{ color: '#fff' }}
            icon={props.onDone && "checkmark-outline"}
            onPress={props.onDone ? props.onDone : props.onNext}>
            {props.showDone ? "done" : "next"}
        </Button>
    </View>
));

interface Props {
    onDone(): void
}

export default function ScreenOnboarding(props: Props) {
    const currentScrollPos = useRef(0);
    const scrollView = useRef<ScrollView>(null);

    const onNextPress = () => {
        const x = currentScrollPos.current + DEVICE_WIDTH;
        scrollView.current?.scrollTo({ animated: true, x });
    }
    const onDonePress = () => {
        props.onDone();
    }
    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        currentScrollPos.current = event.nativeEvent.contentOffset.x;
    }

    return (
        <React.Fragment>
            <StatusBar barStyle='dark-content' backgroundColor="#fff" />
            <ScrollView
                ref={scrollView}
                style={styles.container}
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                onScroll={onScroll}
                showsHorizontalScrollIndicator={false}>
                <OnboardItem
                    image={require("../../assets/images/onboard_bag.png")}
                    title="Create Trip"
                    description="Create amazing trips and other people can join it."
                    onNext={onNextPress} />
                <OnboardItem
                    image={require("../../assets/images/onboard_chat.png")}
                    title="Share With Friends"
                    description="Chat with friends, share photos, text messages and many more."
                    onNext={onNextPress} />
                <OnboardItem
                    image={require("../../assets/images/onboard_location.png")}
                    title="Track in Real Time"
                    showDone
                    description="See the location of each member of your trip in app itself and obviously in Real Time."
                    onDone={onDonePress} />
            </ScrollView>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    itemContainer: {
        flex: 1, width: DEVICE_WIDTH,
        alignItems: 'center', justifyContent: 'center'
    },
    image: {
        width: "100%", height: 220,
        resizeMode: 'contain'
    },
    description: {
        textAlign: 'center',
        marginHorizontal: 35,
        paddingVertical: 18
    },
    button: {
        borderRadius: 22, width: "70%",
        marginTop: 28
    }
});