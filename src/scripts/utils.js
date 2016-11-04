const d = new Date;

const zero = (num, lv = 2) => {
	return (`0000000000${num}`).slice(-lv);
}

module.exports = {
	now: {
		year: d.getFullYear(),
		month: d.getMonth() + 1
	},
	date: {
		year: function(date) {
			return Math.floor(date / 10000);
		},
		month: function(date) {
			return Math.floor(date / 100) % 100;
		},
		date: function(date) {
			return date % 100;
		},
		week_en: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
		week_ja: ['日', '月', '火', '水', '木', '金', '土'],
		week: function(date, lang) {
			lang = lang || 'en';
			const d = new Date(this.format(date));
			const week = d.getDay();
			switch(lang) {
				case 'ja': return this.week_ja[week];
				case 'en': return this.week_en[week];
				default: return week;
			}
		},
		format: function(opts_date) {
			const year = this.year(opts_date);
			const month = this.month(opts_date);
			const date = this.date(opts_date);
			return `${year}-${zero(month)}-${zero(date)}`;
		},
		isToday: function(opts_date) {
			const d = new Date();
			const year = d.getFullYear();
			const month = d.getMonth() + 1;
			const date = d.getDate();
			const format = `${year}${zero(month)}${zero(date)}`;
			if(opts_date == format) {
				return true;
			} else {
				return false;
			}
		},
		lastDate: function(year = d.getFullYear(), month = d.getMonth() + 1) {
			return new Date(year, month, 0).getDate();
		}
	},
	zero: zero
}