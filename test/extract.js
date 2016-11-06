const assert = require('assert');
const extract = require('../extract');

suite('extract', function () {
	suite('html', function () {
		test('with context html string and template object returns result', function () {
			const context = '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Simple</title></head><body><div class="outer-container"><div class="search-results"><a href="#lorem_IPsum_1"><img src="image_1.png"><div class="title"><h1>First title</h1></div></a><a href="#lorem_ipsum_2"><img src="image_2.png"><div class="title"><h1>Second</h1></div></a></div></div><div class="some-other-outer-container"><div class="search-results"><a href="#NONONO"><div class="title"><h1>NO FCKING WAY</h1></div></a></div></div><div class="the-same outer-container"><div class="no-search-results"><a href="#NONONO"><div class="title"><h1>NO FCKING WAY</h1></div></a></div><div class="search-results"><a href="#lorem_ipsum_3"><img src="image_3.png"><div class="title"><h1>Third TiTlE</h1></div></a><a href="#lorem_ipsum_4"><div class="title"><h1>Fourth TITLE</h1><img src="image_4.png"><img src="image_4_2.png"></div></a></div></div></body></html>';
			const template = {
				'selector': '.outer-container>.search-results>a',
				'attributes': {'title': {'selector': '.title>h1'}, 'image': {'selector': 'img', 'from': ['src']}, 'url': {'from': ['href']}}
			};
			const expected = [
				{'image': 'image_1.png', 'title': 'First title', 'url': '#lorem_IPsum_1'}, {'image': 'image_2.png', 'title': 'Second', 'url': '#lorem_ipsum_2'},
				{'image': 'image_3.png', 'title': 'Third TiTlE', 'url': '#lorem_ipsum_3'}, {'image': 'image_4.png', 'title': 'Fourth TITLE', 'url': '#lorem_ipsum_4'}
			];
			assert.deepStrictEqual(extract(context, template), expected);
		});
	});
	suite('object', function () {
		test('with context object and template object returns result', function () {
			const context = {'a': {'b': {'c': [{'href': '#hash', 'text': 'e'}, {href: '#hash2', 'text': 'e2'}, {name: 'e3', href: '#hash3'}]}}};
			const template = {selector: ['a', 'b', 'c'], attributes: {name: {from: [['text'], ['name']]}, url: {from: [['href']]}}};
			const expected = [{name: 'e', url: '#hash'}, {name: 'e2', url: '#hash2'}, {name: 'e3', url: '#hash3'}];
			assert.deepStrictEqual(extract(context, template), expected);
		});
		test('with mixed context structure and template returns result', function () {
			const context = {findItemsByKeywordsResponse: [{ack: [Object], searchResult: {item: [1, 2, 32, 4]}}]};
			const template = {selector: ['findItemsByKeywordsResponse', 'searchResult', 'item']};
			assert.deepStrictEqual(extract(context, template), [1, 2, 32, 4]);
		});
		test('with mixed context structure and template returns result', function () {
			const context = {
				errorMessage: [{
					error: [{
						errorId: ['11002'],
						domain: ['Security'],
						severity: ['Error'],
						category: ['System'],
						message: ['Authentication failed : Invalid Application: ASD'],
						subdomain: ['Authentication'],
						parameter: [{'@name': 'Param1', '__value__': 'Invalid Application: ASD'}]
					}]
				}]
			};
			const template = {selector: ['errorMessage', 'error'], attributes: {id: {from: [['errorId']]}, message: {from: [['message']]}}};
			assert.deepStrictEqual(extract(context, template), [{id: '11002', message: 'Authentication failed : Invalid Application: ASD'}]);
		});
	});
});