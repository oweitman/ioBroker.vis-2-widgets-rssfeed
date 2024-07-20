import React from 'react';

import Marquee from 'react-fast-marquee';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import type { RxRenderWidgetProps } from '@iobroker/types-vis-2';

import type { RSSFeed, RSSArticle } from './types';

import rssExample from './rss.json';

type RxData = {
    count: number;
    speed: number;
    divider: string;
    pauseonhover: boolean;
    withlink: boolean;
    withtime: boolean;
    withdate: boolean;
    withyear: boolean;
    withname: boolean;
    [key: `feed-oid${number}`]: string;
    [key: `feed-name${number}`]: string;
    [key: `feed-maxarticles${number}`]: number;
    [key: `feed-filter${number}`]: string;
};

class RSSArticleMarquee extends (window.visRxWidget || VisRxWidget)<RxData> {
    state: any;

    static getWidgetInfo() {
        return {
            id: 'tplRSSArticleMarquee',
            visSet: 'vis-2-widgets-rssfeed',
            visName: 'RSSFeed Article Marquee',                 // Name of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'count',     // name in data structure
                            type: 'number',
                            default: 0,
                            min: 0,
                            max: Number.MAX_VALUE,
                            step:1,
                            label: 'marquee_count', // translated field label
                            onChange: async (field, data, changeData)  => {
                                const { count } = data;
                                for (let i = 0;  i <= count; i++) {
                                    data[`g_feeds-${i}`] = true;
                                }
                                changeData(data);
                            },
                        },
                        {
                            name: 'speed',     // name in data structure
                            type: 'number',
                            default: 200,
                            min: 1,
                            max: Number.MAX_VALUE,
                            label: 'marquee_speed', // translated field label
                        },
                        {
                            name: 'divider',     // name in data structure
                            type: 'text',
                            default: '+++',
                            label: 'marquee_divider', // translated field label
                        },
                        {
                            name: 'pauseonhover',     // name in data structure
                            type: 'checkbox',
                            default: true,
                            label: 'marquee_pauseonhover', // translated field label
                        },
                        {
                            name: 'withlink',     // name in data structure
                            type: 'checkbox',
                            default: false,
                            label: 'marquee_withlink', // translated field label
                        },
                        {
                            name: 'withtime',     // name in data structure
                            type: 'checkbox',
                            default: false,
                            label: 'marquee_withtime', // translated field label
                        },
                        {
                            name: 'withdate',     // name in data structure
                            type: 'checkbox',
                            default: false,
                            label: 'marquee_withdate', // translated field label
                        },
                        {
                            name: 'withyear',     // name in data structure
                            type: 'checkbox',
                            default: false,
                            label: 'marquee_withyear', // translated field label
                        },
                        {
                            name: 'withname',     // name in data structure
                            type: 'checkbox',
                            default: false,
                            label: 'marquee_withname', // translated field label
                        },
                    ],
                },
                {
                    name: 'feeds', // group name
                    label: 'marquee_feedsgroup', // translated group label
                    indexFrom: 0,
                    indexTo: 'count',
                    fields: [
                        {
                            name: 'feed-oid',     // name in data structure
                            type: 'id',
                            label: 'marquee_oid', // translated field label
                        },
                        {
                            name: 'feed-name',     // name in data structure
                            type: 'text',
                            label: 'marquee_name', // translated field label
                        },
                        {
                            name: 'feed-maxarticles',     // name in data structure
                            type: 'number',
                            default: 1,
                            min: 1,
                            max: Number.MAX_VALUE,
                            label: 'marquee_maxarticles', // translated field label
                        },
                        {
                            name: 'feed-filter',     // name in data structure
                            type: 'text',
                            label: 'marquee_filter', // translated field label
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visDefaultStyle: { // default style
                width: 300,
                height: 26,
            },
            visPrev: '',
        } as const;
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return RSSArticleMarquee.getWidgetInfo();
    }

    static checkFilter(value: string, filters: string, sep?: string) {
        sep = sep || ';';
        const filter = filters.split(sep);
        return filter.reduce((acc, cur) => {
            if (cur === '') {
                return acc;
            }
            return acc || value.toLowerCase().indexOf(cur.toLowerCase()) >= 0;
        }, false);
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const speed: number = this.state.rxData.speed || 200;
        const divider: string = this.state.rxData.divider || '';

        const pauseOnHover: boolean = this.state.rxData.pauseonhover === undefined ? true : this.state.rxData.pauseonhover;

        const withLink: boolean = this.state.rxData.withlink;
        const withTime: boolean = this.state.rxData.withtime || false;
        const withDate: boolean = this.state.rxData.withdate || false;
        const withYear: boolean = this.state.rxData.withyear || false;
        const withName: boolean = this.state.rxData.withname || false;

        const keys = Object.keys(this.state.data).filter(key => /g_feeds-(\d+)/gm.test(key));
        const articles = keys.reduce((acc:RSSArticle[], key) => {
            const test = /g_feeds-(\d+)/gm.exec(key);
            if (!test) return acc;
            const id = test[1];
            const rss: RSSFeed = JSON.parse(this.state.values[`${this.state.data[`feed-oid${id}`]}.val`] || JSON.stringify(rssExample)) as RSSFeed;
            if (!Object.prototype.hasOwnProperty.call(rss, 'articles')) {
                return acc;
            }
            const maxArticles = this.state.values[`feed-maxarticles${id}.val`] || 5;
            const filter = this.state.data[`feed-filter${id}`];
            const name = this.state.data[`feed-name${id}`];
            if (rss && rss.articles && rss.articles.length > maxArticles) {
                rss.articles = rss.articles.slice(0, maxArticles);
            }

            rss.articles = rss.articles.map(item => ({
                title: item.title,
                description: item.description,
                categories: item.categories,
                date: item.date,
                link: item.link,
                meta_description: rss.meta.description,
                meta_name: name,
                meta_title: rss.meta.title,
            } as RSSArticle));

            if (filter) {
                rss.articles = rss.articles.filter(item => RSSArticleMarquee.checkFilter(item.title + item.description + item.categories.toString(), filter));
            }

            return acc.concat(rss.articles);
        }, []);
        articles.sort((aEl: RSSArticle, bEl: RSSArticle) => (new Date(bEl.date)).getTime() - (new Date(aEl.date)).getTime());
        let titles = RSSArticleMarquee.t('marquee_empty');
        if (articles && articles.length > 0) {
            titles = articles.reduce((t, item: RSSArticle) => {
                let time:String[] = [];
                if (withDate) {
                    time.push(this.props.context.formatUtils.formatDate(item.date, 'DD.MM.'));
                }
                if (withYear) {
                    time.push(this.props.context.formatUtils.formatDate(item.date, 'YY'));
                }
                time = [time.join('')];
                if (withTime) {
                    time.push(this.props.context.formatUtils.formatDate(item.date, 'hh:mm'));
                }
                if (withLink) {
                    t += ` ${divider} ${time.join(' ')} ${withName ? `${item.meta_name || item.meta_title}: ` : ''}<a href="${item.link}" target="rssarticle">${time} ${item.title}</a>`;
                } else {
                    t += ` ${divider} ${time.join(' ')} ${withName ? `${item.meta_name || item.meta_title}: ` : ''}${item.title}`;
                }
                return t;
            }, titles);
        }

        return <Marquee
            pauseOnHover={pauseOnHover}
            speed={speed}
        >
            <div>{titles}</div>
        </Marquee>;
    }
}

export default RSSArticleMarquee;
