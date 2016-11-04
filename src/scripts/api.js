'use strict'

const request = require('superagent');
const u = require('./utils');

let menu = {};

module.exports = {
	get: (year = u.now.year, month = u.now.month) => {
		console.log(year, month)
		return new Promise((resolve, reject) => {
			const date = `${year}${u.zero(month)}`;
			// 取得済みの場合は取得しない
			if(menu[date]) {
				resolve(menu[date]);
				return;
			}
			request
				.get(`http://localhost:4301/${year}/${u.zero(month)}`)
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
				.get(`http://localhost:4301/archive`)
				.end((err, res) => {
					console.log(err)
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