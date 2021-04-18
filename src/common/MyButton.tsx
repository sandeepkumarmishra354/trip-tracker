import React, { PureComponent } from 'react'
import { ViewStyle } from 'react-native';
import { Button, withTheme } from 'react-native-paper';

interface Props {
    theme: ReactNativePaper.Theme,
    label: string,
    style?: ViewStyle,
    color?: string,
    icon?: string,
    borderRadius?: number,
    elevation?: number,
    padding?: number,
    loading?: boolean,
    disabled?: boolean,
    onPress?: () => void
}

class MyButton extends PureComponent<Props> {

    render() {
        const { accent } = this.props.theme.colors;
        const { color, style, icon, onPress,
            borderRadius, elevation, disabled, loading,
            label,padding
        } = this.props;
        return (
            <Button
                style={[{
                    backgroundColor: color ?? accent,
                    borderRadius: borderRadius ?? 0,
                    elevation: elevation ?? 0
                }, style]}
                contentStyle={{paddingVertical:padding ?? 0}}
                labelStyle={{ color: "#fff" }}
                icon={icon}
                onPress={onPress}
                loading={loading}
                disabled={disabled}>
                    {label}
            </Button>
        );
    }
}

export default withTheme(MyButton);