import React from 'react';
import { IMessage } from '../../service/service.message';

interface Props {
    messages: IMessage[]
}

export const MessageList = React.memo((props:Props) => {
    return null;
});