import { observer } from 'mobx-react-lite';
import React from 'react';
import ScreenContainer from '../../common/ScreenContainer';
import { AppScreens, NavigationProps } from '../../navigation/navigation.types';

interface Props extends NavigationProps<AppScreens.PROFILE_EDIT> { }

const ScreenProfileEdit = (props: Props) => {

    const navigation = props.navigation;

    return (
        <ScreenContainer
            title="Edit profile"
            showBack={navigation.goBack}>
        </ScreenContainer>
    );
}

export default observer(ScreenProfileEdit)