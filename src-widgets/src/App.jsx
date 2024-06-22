import React from 'react';

import WidgetDemoApp from '@iobroker/vis-2-widgets-react-dev/widgetDemoApp';
import { i18n as I18n } from '@iobroker/adapter-react-v5';

import RSSMetaHelper from './RSSMetaHelper';
import RSSArticleMarquee from './RSSArticleMarquee';
import RSSArticleHelper from './RSSArticleHelper';
import translations from './translations';

class App extends WidgetDemoApp {
    constructor(props) {
        super(props);

        // init translations
        I18n.extendTranslations(translations);
    }

    renderWidget() {
        return <>
            <RSSMetaHelper
                socket={this.socket}
                style={{
                    width: 100,
                    height: 100,
                }}
            />
            <RSSArticleHelper
                socket={this.socket}
                style={{
                    width: 100,
                    height: 100,
                }}
            />
            <RSSArticleMarquee
                socket={this.socket}
                style={{
                    width: 100,
                    height: 100,
                }}
            />
        </>;
    }
}

export default App;
