// IODialog
import React from 'react';
import {
    Button, Dialog, DialogActions,
    DialogContent, DialogTitle,
} from '@mui/material';

import { Close as CloseIcon } from '@mui/icons-material';
import { type Translate } from '@iobroker/adapter-react-v5';

interface RSSDialogProps {
    ActionIcon?: any;
    action?: () => void;
    actionColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    actionDisabled?: boolean;
    actionNoClose?: boolean;
    actionTitle?: string;
    children?: any;
    closeTitle?: string;
    closeDisabled?: boolean;
    dialogActions?: any;
    keyboardDisabled?: boolean;
    onClose: () => void;
    title: string;
    fullScreen?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    minWidth?: number | string;
    noTranslation?: boolean;
    t: Translate;
}

const RSSDialog = (props: RSSDialogProps) => <Dialog
    onClose={props.closeDisabled ? undefined : props.onClose}
    open={!0}
    fullScreen={!!props.fullScreen}
    maxWidth={props.maxWidth || 'md'}
    fullWidth
>
    <DialogTitle>
        {props.noTranslation ? props.title : props.t(props.title)}
    </DialogTitle>
    <DialogContent
        style={{ minWidth: props.minWidth || undefined }}
        onKeyUp={e => {
            if (props.action) {
                if (!props.actionDisabled && !props.keyboardDisabled) {
                    if (e.key === 'Enter') {
                        props.action();
                        if (!props.actionNoClose) {
                            props.onClose();
                        }
                    }
                }
            }
        }}
    >
        {props.children}
    </DialogContent>
    <DialogActions>
        {props.dialogActions || null}
        {props.actionTitle ? <Button
            variant="contained"
            onClick={() => {
                props.action && props.action();
                if (!props.actionNoClose) {
                    props.onClose();
                }
            }}
            color={props.actionColor || 'primary'}
            disabled={props.actionDisabled}
            startIcon={props.ActionIcon ? <props.ActionIcon /> : undefined}
        >
            {props.noTranslation ? props.actionTitle : props.t(props.actionTitle)}
        </Button> : null}
        <Button
            variant="contained"
            color="grey"
            onClick={props.onClose}
            disabled={props.closeDisabled}
            startIcon={<CloseIcon />}
        >
            {props.noTranslation && props.closeTitle ? props.closeTitle : props.t(props.closeTitle || 'Cancel')}
        </Button>
    </DialogActions>
</Dialog>;

export default RSSDialog;
