const cheerio = require('cheerio');
const url = require('url');

function resolveHyperlinks(context, relative) {
	context.find('*[src]').each(function () {
		this['attribs']['src'] = url.resolve(relative, this['attribs']['src']);
	});
	context.find('*[href]').each(function () {
		this['attribs']['href'] = url.resolve(relative, this['attribs']['href']);
	});
}

module.exports = {
	prepareContext: function (context, options) {
		const transformedContext = this.transformContext(context);
		if (options && options.uri) {
			resolveHyperlinks(transformedContext, options.uri);
		}
		return transformedContext;
	},
	transformContext: function (context) {
		return cheerio(context);
	},
	select: function (context, selector) {
		return this.transformContext(context).find(selector);
	},
	getAttribute: function (context, key) {
		const transformedContext = this.transformContext(context);
		return (key ? transformedContext.attr(key) : transformedContext.text());
	},
	iterate: function (context, callback) {
		var result = [];
		this.transformContext(context).each(function () {
			result.push(callback(this));
		});
		return result;
	}
};