import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native';
import { Avatar, Caption, Subheading } from 'react-native-paper';

interface Props {
    photo: string,
    name: string,
    email: string
}
interface State {
    //
}

export default class ProfileHeader extends PureComponent<Props, State> {

    render() {
        return (
            <View
                style={styles.container}>
                <Avatar.Image
                    //icon="person-outline"
                    source={{ uri: this.props.photo }}
                    size={75}
                    style={{ backgroundColor: "#F8F8FF" }} />
                <View style={styles.textContainer}>
                    <Subheading>
                        {this.props.name}
                    </Subheading>
                    <Caption>
                        {this.props.email}
                    </Caption>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 22,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingLeft: 18
    }
});