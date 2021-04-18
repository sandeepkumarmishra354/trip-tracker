import React, { PureComponent } from 'react'
import { View } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';

interface Props {
    showBack?: () => void,
    showHamburger?: () => void,
    elevation?: number,
    title: string,
    subTitle?: string,
    actions?: React.ReactNode
    theme: ReactNativePaper.Theme
}

class ScreenContainer extends PureComponent<Props> {

    render() {
        const { primary } = this.props.theme.colors;
        const { showBack, showHamburger, title, subTitle, children, actions } = this.props;
        return (
            <View
                style={{ flex: 1, width: '100%', backgroundColor: "#fff" }}>
                <Appbar.Header
                    style={{ backgroundColor: primary, elevation: 0, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' }}>
                    {showBack && <Appbar.BackAction color="#757575" onPress={showBack} />}
                    {showHamburger && <Appbar.Action color="#757575" icon="menu-outline" onPress={showHamburger} />}
                    <Appbar.Content
                        title={title}
                        subtitle={subTitle}
                        subtitleStyle={{ color: "#cccccc" }}
                        titleStyle={{ fontSize: 18, color: "#757575" }} />
                    {actions && actions}
                </Appbar.Header>
                {children && children}
            </View>
        );
    }

}

export default withTheme(ScreenContainer);