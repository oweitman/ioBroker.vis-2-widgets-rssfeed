// TextDialog
import React, { useEffect, useState } from 'react';

import type { ThemeType, Translate } from '@iobroker/adapter-react-v5';
import RSSDialog from './RSSDialog.tsx';
import EJSAceEditor from './EJSAceEditor.tsx';

interface EJSDialogProps {
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    onClose: () => void;
    value: string;
    themeType: ThemeType;
    t: Translate;
}

const EJSDialog = (props: EJSDialogProps) => {
    const [value, changeValue] = useState('');

    useEffect(() => {
        changeValue(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <RSSDialog
        keyboardDisabled
        title="widget_title"
        actionTitle="widget_save"
        action={() => props.onChange(value)}
        onClose={props.onClose}
        actionDisabled={value === props.value}
        t={props.t}
    >
        <EJSAceEditor
            value={value}
            focus
            height={400}
            onChange={newValue => changeValue(newValue)}
            themeType={props.themeType}
        />
    </RSSDialog>;
};

export default EJSDialog;
