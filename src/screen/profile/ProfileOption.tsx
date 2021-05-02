import React from 'react';
import { List } from 'react-native-paper';

interface Props {
    openOngoingTrip(): void
}

const ProfileOption = React.memo((props: Props) => {

    return (
        <List.Section>
            <List.Item
                title="Ongoing Trip"
                description="view details of currently joined trip."
                left={props => <List.Icon {...props} icon="car-sport-outline" />}
                onPress={props.openOngoingTrip} />
            {/*<List.Item
                title="Previous Trip"
                description="view all your previous trips."
                left={props => <List.Icon {...props} icon="trail-sign-outline" />}
                onPress={onPress} />
            <List.Item
                title="Notification"
                description="new message/info alert."
                left={props => <List.Icon {...props} icon="notifications-outline" />}
                right={props => (
                    <Switch {...props}
                        value={notificationStatus}
                        color={accent}
                        onValueChange={changeNotStatus} />
                )}
                onPress={changeNotStatus} />
            <List.Item
                title="Privacy policy"
                left={props => <List.Icon {...props} icon="shield-outline" />}
                onPress={onPress} />
            <List.Item
                title="Term's and condition"
                left={props => <List.Icon {...props} icon="reader-outline" />}
                onPress={onPress} />*/}
        </List.Section>
    );
});

export default ProfileOption;