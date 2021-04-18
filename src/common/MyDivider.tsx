import React from 'react';
import { Divider } from 'react-native-paper';

interface Props {
    height?: number,
    color?: string
}

const MyDivider = React.memo((props: Props) => {
    const { color, height } = props;
    return <Divider
        style={{ height: height ?? 0.5, backgroundColor: color ?? "#f5f5f5" }} />;
});

export default MyDivider;