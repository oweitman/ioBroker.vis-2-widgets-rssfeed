import React from 'react';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import translations from './translations';
import rssExample from './rss.json';

class RSSArticleHelper extends (window.visRxWidget || VisRxWidget) {
    static getWidgetInfo() {
        return {
            id: 'tplRSSArticleHelper',
            visSet: 'vis-2-widgets-rssfeed',
            visName: 'RSSFeed Article Helper',                 // Name of widget
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
                            name: 'prefix',     // name in data structure
                            type: 'text',
                            default: 'item',
                            label: 'articlehelper_prefix', // translated field label
                        },
                        {
                            name: 'article',     // name in data structure
                            type: 'number',
                            default: 1,
                            min: 1,
                            max:9999,
                            step:1,
                            label: 'metahelper_oid', // translated field label
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visPrev: '',
        };
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return RSSArticleHelper.getWidgetInfo();
    }

    // eslint-disable-next-line class-methods-use-this
    getI18nPrefix() {
        return translations.prefix;
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        /*         if (!this.state.values[`${this.state.rxData.oid}.val`]) {
            return null;
        } */

        const thStyle = { whiteSpace: 'nowrap', textAlign: 'left', verticalAlign: 'top' };
        const rss = JSON.parse(this.state.values[`${this.state.rxData.oid}.val`] || JSON.stringify(rssExample));
        const article = parseInt(this.state.rxData.article) || 1;
        const prefix = this.state.rxData.prefix || 'item';
        const item = rss.articles[article - 1];
        let result;

        if (item) {
            result = <table>
                <tbody>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .title
                        </th>
                        <td>
                            {item.title}
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                            .description
                        </th>
                        <td>
                            { /* eslint-disable-next-line react/no-danger */ }
                            <div dangerouslySetInnerHTML={{ __html:item.description }}></div>
                        </td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .summary
                        </th>
                        <td>{item.summary}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .link
                        </th>
                        <td>{item.link}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .origlink
                        </th>
                        <td>{item.origlink}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .permalink
                        </th>
                        <td>{item.permalink}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .date
                        </th>
                        <td>{item.date}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .pubdate
                        </th>
                        <td>{item.pubdate}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .author
                        </th>
                        <td>{item.author}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .guid
                        </th>
                        <td>{item.guid}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .comments
                        </th>
                        <td>{item.comments}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .image.url
                        </th>
                        <td>{item.image.url}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .image.title
                        </th>
                        <td>{item.image.title}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .categories
                        </th>
                        <td>{item.categories}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .source
                        </th>
                        <td>{JSON.stringify(item.source)}</td>
                    </tr>
                    <tr>
                        <th style={thStyle}>
                            {prefix}
                        .enclosures
                        </th>
                        <td>{JSON.stringify(item.enclosures)}</td>
                    </tr>
                </tbody>
            </table>;
        } else {
            result = <table
                className="rssfeed attributes"
            >
                <tbody>
                    <tr>
                        <th>
                            No Data. End of List of
                            {' '}
                            {rss.articles.length }
                            {' '}
                            Articles
                        </th>
                    </tr>
                </tbody>
            </table>;
        }
        return result;
    }
}

export default RSSArticleHelper;
