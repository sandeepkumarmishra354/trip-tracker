import React from 'react';
import { Linking } from 'react-native';
import { Divider, List } from 'react-native-paper';

const privacy_url = "https://www.privacypolicies.com/live/e05f2ba4-5565-4dd2-bfc3-5aa745191f38";
const terms_url = "https://www.websitepolicies.com/policies/view/kb45CpoF";

interface Props {
    openOngoingTrip(): void
}

const ProfileOption = React.memo((props: Props) => {

    const onPrivacyPolicyPress = () => {
        Linking.openURL(privacy_url);
    }
    const onTermsConditionPress = () => {
        Linking.openURL(terms_url);
    }

    return (
        <List.Section>
            <List.Item
                title="Ongoing Trip"
                description="View details of currently joined trip."
                left={props => <List.Icon {...props} icon="car-sport-outline" />}
                onPress={props.openOngoingTrip} />
            <Divider/>
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
                onPress={changeNotStatus} />*/}
            <List.Item
                title="Privacy policy"
                description="Read privacy policy"
                left={props => <List.Icon {...props} icon="shield-outline" />}
                onPress={onPrivacyPolicyPress} />
            <Divider />
            <List.Item
                title="Term's and condition"
                description="Read term's and conditions"
                left={props => <List.Icon {...props} icon="reader-outline" />}
                onPress={onTermsConditionPress} />
        </List.Section>
    );
});

export default ProfileOption;