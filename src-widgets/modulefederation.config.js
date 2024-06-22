const makeFederation = require('@iobroker/vis-2-widgets-react-dev/modulefederation.config');

module.exports = makeFederation(
    'vis2rssfeedWidgets', // internal name of package - must be unique and identical with io-package.json=>common.visWidgets.vis2demoWidget
    {
        './RSSArticleMarquee': './src/RSSArticleMarquee', // List of all widgets in this package
        './RSSMetaHelper': './src/RSSMetaHelper', // List of all widgets in this package
        './RSSArticleHelper': './src/RSSArticleHelper', // List of all widgets in this package
        './RSSWidget': './src/RSSWidget', // List of all widgets in this package
        './translations': './src/translations',
    },
);
