const each = require('each');

const strategies = [
	require('./strategies/object'),
	require('./strategies/html')
];

function getExtractor(context) {
	for (var i = 0; i < strategies.length; i++) {
		try {
			return {extractor: strategies[i], context: strategies[i].prepareContext(context)};
		} catch (error) {
		}
	}
}

function getFirstAttribute(extractor, item, attributes) {
	for (var i = 0; i < attributes.length; i++) {
		var attributeValue = extractor.getAttribute(item, attributes[i]);
		if (attributeValue !== undefined) {
			return attributeValue;
		}
	}
}

function extract(extractor, context, template) {
	const selector = template['selector'];
	const attributes = template['attributes'];
	const from = template['from'];
	if (selector) {
		context = extractor.select(context, selector);
	}
	if (attributes) {
		return extractor.iterate(context, function (item) {
			return each(attributes, function (attributeTemplate) {
				return extract(extractor, item, attributeTemplate);
			});
		});
	}
	return from ? getFirstAttribute(extractor, context, from) : extractor.getAttribute(context);
}

module.exports = function (context, template) {
	const data = getExtractor(context);
	return extract(data.extractor, data.context, template);
};