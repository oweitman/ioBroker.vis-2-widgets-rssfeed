import React, {
    useState,
} from 'react';

import {
    TextField, Button,
} from '@mui/material';
import {
    Edit as EditIcon,
} from '@mui/icons-material';
import type { ThemeType, Translate } from '@iobroker/adapter-react-v5';
import type { RxWidgetInfoAttributesField, WidgetData } from '@iobroker/types-vis-2';

import EJSDialog from './EJSDialog.tsx';

interface VisEJSAttributeFieldProps {
    field: RxWidgetInfoAttributesField;
    data: WidgetData;
    // eslint-disable-next-line no-unused-vars
    onDataChange: (data: WidgetData) => void;
    themeType: ThemeType;
    t: Translate;
}

const VisEJSAttributeField = (
    {
        field,        // field properties: {name, label, type, set, singleName, component,...}
        data,         // widget data
        onDataChange, // project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, __settings: {}}
        themeType,
        t,
    }: VisEJSAttributeFieldProps,
) => {
    const [idDialog, setIdDialog] = useState(false);

    return <>
        <TextField
            size="small"
            sx={{ '& input': { fontSize: 'small' } }}
            // placeholder={isDifferent ? t('different') : null}
            variant="standard"
            value={data && data[field.name]}
            fullWidth
            onChange={e => {
                onDataChange({
                    [field.name]: e.target.value,
                }); // returns all changed field as an object.
                // If some property is null, so it will be deleted from data
            }}
            InputProps={{
                endAdornment: <Button
                    style={{ minWidth: 40 }}
                    size="small"
                    onClick={() => setIdDialog(true)}
                >
                    <EditIcon />
                </Button>,
            }}
            rows={2}
        />
        {idDialog ? <EJSDialog
            value={data[field.name]}
            onChange={newValue => onDataChange({ [field.name]: newValue })}
            onClose={() => setIdDialog(false)}
            themeType={themeType}
            t={t}
        /> : null}
    </>;
};

export default VisEJSAttributeField;
