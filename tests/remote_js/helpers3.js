const { JSDOM } = require("jsdom");
const chai = require('chai');
const assert = chai.assert;
const Helpers = require('./helpers');

class Helpers3 extends Helpers {
	static assertTotalResults(response, expectedCount) {
		const totalResults = parseInt(response.headers['total-results'][0]);
		assert.isNumber(totalResults);
		assert.equal(totalResults, expectedCount);
	}

	static assertNumResults = (response, expectedResults) => {
		const contentType = response.headers['content-type'][0];
		if (contentType == 'application/json') {
			const json = JSON.parse(response.data);
			assert.lengthOf(Object.keys(json), expectedResults);
		}
		else if (contentType == 'text/plain') {
			const rows = response.data.split("\n").trim();
			assert.lengthOf(rows, expectedResults);
		}
		else if (contentType == 'application/x-bibtex') {
			let matched = response.getBody().match(/^@[a-z]+{/gm);
			assert.equal(matched, expectedResults);
		}
		else if (contentType == 'application/atom+xml') {
			const doc = new JSDOM(response.data, { url: "http://localhost/" });
			const entries = this.xpathEval(doc.window.document, "//entry", false, true);
			assert.equal(entries.length, expectedResults);
		}
		else {
			throw new Error(`Unknonw content type" ${contentType}`);
		}
	};
}
module.exports = Helpers3;
