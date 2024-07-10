import React from 'react';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

import rssExample from './rss.json';
import translations from './translations';

class RSSMetaHelper extends (window.visRxWidget || VisRxWidget) {
    static getWidgetInfo() {
        return {
            id: 'tplRSSMetaHelper',
            visSet: 'vis-2-widgets-rssfeed',
            visName: 'RSSFeed Meta Helper',                 // Name of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'oid',     // name in data structure
                            type: 'id',
                            label: 'metahelper_oid', // translated field label
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visPrev: '',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getI18nPrefix() {
        return translations.prefix;
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return RSSMetaHelper.getWidgetInfo();
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const thStyle = { whiteSpace: 'nowrap', textAlign: 'left', verticalAlign: 'top' };
        const rss = JSON.parse(this.state.values[`${this.state.rxData.oid}.val`] || JSON.stringify(rssExample));

        return <table
            style={{ whiteSpace: 'nowrap' }}
        >
            <tbody>
                <tr>
                    <th style={thStyle}>meta.title</th>
                    <td>{rss.meta.title}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.description</th>
                    <td>{rss.meta.description}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.link</th>
                    <td>{rss.meta.link}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.xmlurl</th>
                    <td>{rss.meta.xmlurl}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.date</th>
                    <td>{rss.meta.date}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.pubdate</th>
                    <td>{rss.meta.pubdate}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.author</th>
                    <td>{rss.meta.author}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.language</th>
                    <td>{rss.meta.language}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.image.url</th>
                    <td>{rss.meta.image.url}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.image.title</th>
                    <td>{rss.meta.image.title}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.favicon</th>
                    <td>{rss.meta.favicon}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.copyright</th>
                    <td>{rss.meta.copyright}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.generator</th>
                    <td>{rss.meta.generator}</td>
                </tr>
                <tr>
                    <th style={thStyle}>meta.categories</th>
                    <td>{rss.meta.categories}</td>
                </tr>
            </tbody>
        </table>;
    }
}
export default RSSMetaHelper;
