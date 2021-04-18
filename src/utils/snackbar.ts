import { createRef } from 'react';
import MySnackbar, { ISnackbarOption } from '../common/MySnackbar';

export const snackbarRef = createRef<MySnackbar>();

export const snackbar = {
    show: (options: ISnackbarOption) => {
        snackbarRef.current?.show(options);
    },
    hide: () => {
        snackbarRef.current?.hide();
    }
}