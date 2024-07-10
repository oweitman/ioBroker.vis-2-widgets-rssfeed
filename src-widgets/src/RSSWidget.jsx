import React from 'react';
import PropTypes from 'prop-types';
import ejs from 'ejs';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import VisEJSAttributeField from './Components/VisEJSAttributeField.tsx';

import rssExample from './rss.json';
import translations from './translations';

class RSSWidget extends (window.visRxWidget || VisRxWidget) {
    static getWidgetInfo() {
        const defaultTemplate = `
<!--
 available variables:
 widgetId      ->  id of the widget 
 rss.meta      ->  all meta information of a feed, details see Meta Helper widget 
 rss.articles  ->  all articles as array, details see Article Helper widget 
 style         ->  all style settings for the widget
 
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
                                field,       // field properties: {name, label, type, set, singleName, component,...}
                                data,        // widget data
                                onDataChange, // function to call when data changed
                                props,       // additional properties: {socket, projectName, instance, adapterName, selectedView, selectedWidgets, project, widgetID}
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
                            max:9999,
                            step:1,
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
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getI18nPrefix() {
        return 'vis_2_widgets_rssfeed_';
    }

    static t(word) {
        return super.t(`vis_2_widgets_rssfeed_${word}`);
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return RSSWidget.getWidgetInfo();
    }

    // eslint-disable-next-line class-methods-use-this
    static checkHighlight(value, highlights, sep) {
        sep = typeof sep !== 'undefined' ? sep : ';';
        const highlight = highlights.split(sep);
        return highlight.reduce((acc, cur) => {
            if (cur === '') return acc;
            return acc || value.toLowerCase().includes(cur.toLowerCase());
        }, false);
    }

    // eslint-disable-next-line class-methods-use-this
    escapeHTML(html) {
        let escapeEl = document.createElement('textarea');
        escapeEl.textContent = html;
        const ret = escapeEl.innerHTML;
        escapeEl = null;
        return ret;
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const rss = JSON.parse(this.state.values[`${this.state.rxData.oid}.val`] || JSON.stringify(rssExample));
        const data = props.widget.data;
        const overflowX = props.style.overflowX;
        const overflowY = props.style.overflowY;
        props.style.overflowX = 'hidden';
        props.style.overflowY = 'hidden';

        const template = data.template;
        const filter = data.filter ? data.filter : '';
        let maxArticles = data.max ? data.max : 999;
        maxArticles = maxArticles > 0 ? maxArticles : 1;
        if (rss && rss.articles && rss.articles.length > maxArticles) rss.articles = rss.articles.slice(0, maxArticles);

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
            text = this.escapeHTML(e.message).replace(/(?:\r\n|\r|\n)/g, '<br>');
            text = text.replace(/ /gm, '&nbsp;');
            text = `<code style="color: red;">${text}</code>`;
        }

        return <div
            style={{ overflowX, overflowY, width: '100%', height: '100%' }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: text }}
        />;
    }
}

RSSWidget.propTypes = {
    systemConfig: PropTypes.object,
    socket: PropTypes.object,
    themeType: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.object,
};

export default RSSWidget;
