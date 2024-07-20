import React from 'react';
import ejs from 'ejs';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import type {
    RxRenderWidgetProps,
    RxWidgetInfoAttributesField,
    RxWidgetInfoCustomComponentProperties,
    WidgetData,
} from '@iobroker/types-vis-2';

import type { RSSFeed } from './types';
import VisEJSAttributeField from './Components/VisEJSAttributeField.tsx';

import rssExample from './rss.json';

type RxData = {
    oid: string;
    template?: string;
    max?: number;
    filter?: string;
};

class RSSWidget extends (window.visRxWidget || VisRxWidget)<RxData> {
    state: any;

    static getWidgetInfo() {
        const defaultTemplate = `
<!--
 available variables:
 widgetId     -> id of the widget 
 rss.meta     -> all meta information of a feed, details see Meta Helper widget 
 rss.articles -> all articles as array, details see Article Helper widget 
 style        -> all style settings for the widget
 
 all variables are read-only
-->
<style>
#<%- widgetid %> img {
    width: calc(<%- style.width %> - 15px);
    height: auto;
}
#<%- widgetid %> img.rssfeed  {
    width: auto;
    height: auto;
}
</style>
<p><%- rss.meta.title %> </p>
<% rss.articles.forEach(function(item){ %>
    <div class="article">
    <p><small><%- vis.formatDate(item.pubdate, "TT.MM.JJJJ SS:mm") %></small></p>    
    <h3><%- item.title %></h3>
    <p><%- item.description %></p>
    <div style="clear:both;"></div>
</div>
<% }); %> 
`;
        return {
            id: 'tplRSSWidget',
            visSet: 'vis-2-widgets-rssfeed',
            visSetLabel: 'vis_2_rssfeed',
            visName: 'RSSFeed Widget',                 // Name of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'oid',     // name in data structure
                            type: 'id',
                            label: 'metahelper_oid', // translated field label
                        },
                        {
                            name: 'template',     // name in data structure
                            type: 'custom',
                            label: 'widget_template', // translated field label
                            default: defaultTemplate,
                            component: (     // important
                                field: RxWidgetInfoAttributesField,       // field properties: {name, label, type, set, singleName, component,...}
                                data: WidgetData,        // widget data
                                // eslint-disable-next-line no-unused-vars
                                onDataChange: (_data: WidgetData) => void, // function to call when data changed
                                props: RxWidgetInfoCustomComponentProperties,       // additional properties: {socket, projectName, instance, adapterName, selectedView, selectedWidgets, project, widgetID}
                                // socket,      // socket object
                                // widgetID,    // widget ID or widget IDs. If selected more than one widget, it is array of IDs
                                // view,        // view name
                                // project,      // project object: {VIEWS..., [view]: {widgets: {[widgetID]: {tpl, data, style}}, settings, parentId, rerender, filterList, activeWidgets}, __settings: {}}
                            ) => <VisEJSAttributeField
                                field={field}
                                data={data}
                                onDataChange={onDataChange}
                                themeType={props.context.theme.palette.mode}
                                t={RSSWidget.t}
                            />,
                        },
                        {
                            name: 'max',     // name in data structure
                            type: 'number',
                            default: 5,
                            min: 1,
                            max: 9999,
                            label: 'widget_maxarticles', // translated field label
                        },
                        {
                            name: 'filter',     // name in data structure
                            type: 'text',
                            default: '',
                            label: 'widget_filter', // translated field label
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visDefaultStyle: { // default style
                width: 300,
                height: 300,
                'overflow-x': 'hidden',
                'overflow-y': 'auto',
            },
            visPrev: '',
        } as const;
    }

    // eslint-disable-next-line class-methods-use-this
    static getI18nPrefix(): string {
        return 'vis_2_widgets_rssfeed_';
    }

    static t(word: string): string {
        return super.t(`vis_2_widgets_rssfeed_${word}`);
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return RSSWidget.getWidgetInfo();
    }

    static checkHighlight(value: string, highLights: string, sep?: string): boolean {
        sep = sep || ';';
        const highLight = highLights.split(sep);
        return highLight.reduce((acc, cur) => {
            if (cur === '') {
                return acc;
            }
            return acc || value.toLowerCase().includes(cur.toLowerCase());
        }, false);
    }

    static escapeHTML(html: string): string {
        let escapeEl: HTMLTextAreaElement|null = document.createElement('textarea');
        escapeEl.textContent = html;
        const ret = escapeEl.innerHTML;
        escapeEl = null;
        return ret;
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        const rss: RSSFeed = JSON.parse(this.state.values[`${this.state.rxData.oid}.val`] || JSON.stringify(rssExample)) as RSSFeed;
        const data = props.widget.data;
        const overflowX: React.CSSProperties['overflowX'] = props.style.overflowX;
        const overflowY: React.CSSProperties['overflowY'] = props.style.overflowY;
        props.style.overflowX = 'hidden';
        props.style.overflowY = 'hidden';

        const template = data.template;
        const filter = data.filter ? data.filter : '';
        let maxArticles = data.max ? data.max : 999;
        maxArticles = maxArticles > 0 ? maxArticles : 1;
        if (rss?.articles?.length > maxArticles) {
            rss.articles = rss.articles.slice(0, maxArticles);
        }

        if (filter !== '') {
            rss.articles = rss.articles.filter(item => RSSWidget.checkHighlight(item.title + item.description + item.categories.toString(), filter));
        }
        let text = '';
        try {
            if (typeof rss.meta === 'undefined') {
                return <div>{RSSWidget.t('No Object ID set')}</div>;
            }
            text = ejs.render(template, {
                rss,
                widgetid: props.id,
                widgetId: props.id,
                style: props.style,
            });
        } catch (e) {
            text = RSSWidget.escapeHTML(e.message).replace(/\r\n|\r|\n/g, '<br>');
            text = text.replace(/ /gm, '&nbsp;');
            text = `<code style="color: red;">${text}</code>`;
        }

        return <div
            style={{
                overflowX,
                overflowY,
                width: '100%',
                height: '100%',
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: text }}
        />;
    }
}

export default RSSWidget;
