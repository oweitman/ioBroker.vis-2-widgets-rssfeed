import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

declare global {
    interface Window {
        visRxWidget?: typeof VisRxWidget;
    }
}

export interface RSSArticle {
    title: string;
    description: string;
    link: string;
    pubdate?: string;
    categories: string[];
    summary?: string;
    origlink?: string;
    permalink?: string;
    date: string;
    author?: string;
    guid?: string;
    comments?: string;
    image?: Record<string, string>;
    source?: Record<string, string>;
    enclosures?: string[];
    meta_name?: string;
    meta_description?: string;
    meta_title?: string;
}

export interface RSSFeed {
    meta: {
        title: string;
        description: string;
        link: string;
        xmlurl: string;
        date: string;
        pubdate: string;
        author: string;
        language: string;
        image: Record<string, string>;
        favicon: string;
        copyright: string;
        generator: string;
        categories: string[];
    },
    articles: RSSArticle[];
}
