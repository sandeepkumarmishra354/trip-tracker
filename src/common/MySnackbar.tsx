import React, { PureComponent } from 'react';
import { Snackbar } from 'react-native-paper';

type SnackbarType = 'normal' | 'success' | 'error';

interface State {
    visible: boolean,
    duration: number,
    message: string,
    color: string,
    action?: {
        label: string,
        onPress(): void
    }
}
export interface ISnackbarOption {
    message: string,
    duration?: number,
    action?: {
        label: string,
        onPress(): void
    },
    type?: SnackbarType
}

export default class MySnackbar extends PureComponent<{}, State> {

    private readonly DEFAULT_DURATION = 3000; //miliseconds
    private readonly colorNormal = '#242B2E';
    private readonly colorSuccess = '#1FAA59';
    private readonly colorError = '#B4161B';

    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            duration: this.DEFAULT_DURATION,
            message: '',
            color: this.colorNormal
        };
    }

    private _getColor = (type: SnackbarType) => {
        switch(type) {
            case 'normal':
                return this.colorNormal;
            case 'success':
                return this.colorSuccess;
            case 'error':
                return this.colorError;
        }
    }

    private _onDismiss = () => {
        if (this.state.visible) {
            this.setState({
                visible: false,
                message: '',
                duration: this.DEFAULT_DURATION,
                action: undefined
            });
        }
    }

    public show = (options: ISnackbarOption) => {
        this.setState({
            visible: true,
            message: options.message,
            duration: options.duration ?? this.DEFAULT_DURATION,
            action: options.action,
            color: this._getColor(options.type ?? 'normal')
        });
    }

    public hide = () => {
        this._onDismiss();
    }

    render() {
        return (
            <Snackbar
                style={{ backgroundColor: this.state.color }}
                visible={this.state.visible}
                duration={this.state.duration}
                action={this.state.action}
                onDismiss={this._onDismiss}>
                {this.state.message}
            </Snackbar>
        );
    }

}