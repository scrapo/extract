const cheerio = require('cheerio');

module.exports = {
	prepareContext: function (context) {
		return this.transformContext(context);
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