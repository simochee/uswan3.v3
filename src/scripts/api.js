'use strict'

const request = require('superagent');
const u = require('./utils');

let menu = {};

module.exports = {
	get: (year = u.now.year, month = u.now.month, word = null) => {
		return new Promise((resolve, reject) => {
			const date = `${year}${u.zero(month)}`;
			// 取得済みの場合は取得しない
			if(menu[date]) {
				resolve(menu[date]);
				return;
			}
			const url = word === null ? `http://uswan-api.simo.website/${year}/${u.zero(month)}`
									  : `http://uswan-api.simo.website/${year}/${u.zero(month)}/${word}`;
			request
				.get(url)
				.end((err, res) => {
					if(err) {
						reject(err);
						return;
					}
					menu[date] = res.body;
					resolve(res.body);
				});
		});
	},
	archive: () => {
		return new Promise((resolve, reject) => {
			if(menu.archive) {
				resolve(menu.archive);
				return;
			}
			request
				.get(`http://uswan-api.simo.website/archive`)
				.end((err, res) => {
					if(err) {
						reject(err);
						return;
					}
					menu.archive = res.body;
					resolve(res.body);
				});
		});
	}
}