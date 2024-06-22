// TextDialog
import React, { useEffect, useState } from 'react';

import RSSDialog from './RSSDialog.tsx';
import EJSAceEditor from './EJSAceEditor.tsx';

interface EJSDialogProps {
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    onClose: () => void;
    open: boolean;
    themeType: string;
    type: string;
    value: string;
}

const EJSDialog = (props: EJSDialogProps) => {
    const [value, changeValue] = useState('');

    useEffect(() => {
        changeValue(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);

    return props.open ? <RSSDialog
        keyboardDisabled
        title={props.type === 'json' ? 'JSON edit' : (props.type === 'html' ? 'HTML edit' : 'Text edit')}
        open={!0}
        actionTitle="Save"
        action={() => props.onChange(value)}
        onClose={props.onClose}
        minWidth={800}
        actionDisabled={value === props.value}
    >
        <EJSAceEditor
            type={props.type}
            themeType={props.themeType}
            value={value}
            focus
            height={400}
            onChange={newValue => changeValue(newValue)}
        />
    </RSSDialog> : null;
};

export default EJSDialog;
