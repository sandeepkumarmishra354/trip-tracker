import { ToastAndroid } from 'react-native';

interface IToastOption {
    message: string,
    gravity?: 'BOTTOM' | 'CENTER' | 'TOP',
    duration?: 'LONG' | 'SHORT'
};

export const toaster = {
    show: (option: IToastOption) => {
        const message = option.message;
        const duration = option.duration ? ToastAndroid[option.duration] : ToastAndroid.SHORT;
        const gravity = option.gravity ? ToastAndroid[option.gravity] : ToastAndroid.BOTTOM;
        ToastAndroid.showWithGravity(message, duration, gravity);
    }
};