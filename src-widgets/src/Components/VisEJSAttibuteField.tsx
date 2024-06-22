import React, {
    useState,
} from 'react';

import {
    TextField, Button,
} from '@mui/material';
import {
    Edit as EditIcon,
} from '@mui/icons-material';
import {
    I18n,
} from '@iobroker/adapter-react-v5';

import EJSDialog from './EJSDialog.tsx';

const VisEJSAttibuteField = (
    {
        field,       // field properties: {name, label, type, set, singleName, component,...}
        data,        // widget data
        onDataChange,      // project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, __settings: {}}
        props,
        ...argument
    },
) => {
    const error = '';
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [idDialog, setIdDialog] = useState(false);
    console.log(argument);
    return <>
        <TextField
            size="small"
            // placeholder={isDifferent ? t('different') : null}
            variant="standard"
            value={data && data[field.name]}
            fullWidth
            error={!!error}
            helperText={typeof error === 'string' ? I18n.t(error) : null}
            onChange={e => {
                onDataChange({
                    [field.name]: e.target.value,
                }); // returns all changed field as object.
                // If some propertiy is null, so it will be deleted from data
            }}
            InputProps={{
                endAdornment: <Button
                    size="small"
                    onClick={() => setIdDialog(true)}
                >
                    <EditIcon />
                </Button>,
                classes: {
                    // input: Utils.clsx(props.classes.clearPadding, props.classes.fieldContent),
                },
            }}
            rows={2}
        />
        {idDialog ? <EJSDialog
            open={!0}
            value={data[field.name]}
            onChange={
                newValue => onDataChange({ [field.name]:newValue })
            }
            onClose={
                () => setIdDialog(false)
            }
            themeType=""
            type={field.type}
        /> : null}
    </>;
};
export default VisEJSAttibuteField;
