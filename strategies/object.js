const each = require('each');
const select = require('select');

module.exports = {
	prepareContext: function (context) {
		return typeof context === 'string' ? JSON.parse(context) : context;
	},
	transformContext: function (context) {
		return context;
	},
	select: function (context, selector) {
		return select(context, selector || []);
	},
	getAttribute: function (context, key) {
		return select(context || {}, key || []);
	},
	iterate: function (context, callback) {
		return each(Array.isArray(context) ? context : [context], callback);
	}
};