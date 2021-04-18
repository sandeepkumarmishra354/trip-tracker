import React, { createRef, PureComponent } from 'react'
import { Animated, BackHandler, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Portal } from 'react-native-paper';

interface SheetProps {
    onHide(): void,
    dismissOnTouch?: boolean,
    fullScreen: boolean
}

class ActionSheet extends PureComponent<SheetProps> {

    private readonly SLIDE_X = 1000;
    private animeSlide: Animated.Value;
    private animeOpacity: Animated.Value;

    constructor(props: SheetProps) {
        super(props);
        this.animeSlide = new Animated.Value(this.SLIDE_X);
        this.animeOpacity = new Animated.Value(0);
    }

    componentDidMount = () => {
        this.animate('up');
    }

    public animate = (mode: 'up' | 'down', onEnd?: () => void) => {
        Animated.parallel([
            Animated.timing(this.animeSlide, {
                toValue: (mode === 'up') ? 0 : this.SLIDE_X,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(this.animeOpacity, {
                toValue: (mode === 'up') ? 1 : 0,
                duration: (mode === 'up') ? 350 : 250,
                useNativeDriver: true,
            })
        ]).start(onEnd);
    }

    render() {
        return (
            <Animated.View
                style={[
                    styles.container,
                    this.props.fullScreen ? { maxHeight: '100%', height: '100%' } : {},
                    {
                        transform: [{ translateY: this.animeSlide }],
                        opacity: this.animeOpacity
                    }
                ]}>
                <TouchableWithoutFeedback
                    onPress={this.props.dismissOnTouch ? this.props.onHide : undefined}>
                    <View
                        style={{
                            width: '100%', flexGrow: 1,
                        }} />
                </TouchableWithoutFeedback>
                <View
                    style={[
                        styles.content,
                        this.props.fullScreen && { maxHeight: '100%' },
                    ]}>
                    <View style={styles.needleStyle}/>
                    {this.props.children}
                </View>
            </Animated.View>
        );
    }
}

interface Props {
    onHidden?: () => void,
    dismissOnTouch?: boolean,
    dismissOnBack?: boolean,
    fullScreen?: boolean,
}

export default class MyActionSheet extends PureComponent<Props, { showSheet: boolean }> {

    private _sheetRef = createRef<ActionSheet>();

    constructor(props: Props) {
        super(props);
        this.state = { showSheet: false };
    }

    private _setShowSheet = (status: boolean) => {
        if (this.state.showSheet !== status)
            this.setState({ showSheet: status });
    }
    private _handleBack = () => {
        const dismissOnBack = this.props.dismissOnBack ?? true;
        if (this.state.showSheet) {
            if (dismissOnBack) {
                this.hide();
                return true;
            }
            return true;
        }
        return false;
    }

    public show = () => {
        if (!this.state.showSheet) {
            this._setShowSheet(true);
            BackHandler.addEventListener('hardwareBackPress', this._handleBack);
        }
    }
    public hide = () => {
        if (this.state.showSheet) {
            this._sheetRef.current?.animate('down', () => {
                this._setShowSheet(false);
                BackHandler.removeEventListener('hardwareBackPress', this._handleBack);
                if (this.props.onHidden)
                    this.props.onHidden();
            });
        }
    }
    public isShowing = () => this.state.showSheet;

    render() {
        const { children, dismissOnTouch, fullScreen } = this.props;
        if (this.state.showSheet)
            return <Portal>
                <ActionSheet
                    ref={this._sheetRef}
                    onHide={this.hide}
                    children={children}
                    dismissOnTouch={dismissOnTouch ?? true}
                    fullScreen={fullScreen ?? false} />
            </Portal>;
        return null;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#00000040'
    },
    content: {
        width: '100%',
        maxHeight: '90%',
        minHeight: 30,
        backgroundColor: '#ffffff',
        elevation: 40,
        borderTopStartRadius:8,
        borderTopEndRadius:8,
    },
    needleStyle: {
        width: 45, height: 8, backgroundColor: '#f5f5f5',
        marginTop: 12, marginBottom: 12,
        borderRadius: 5, alignSelf:'center'
    }
});