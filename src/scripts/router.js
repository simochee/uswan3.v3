require('./tags/common/navbar');
require('./tags/common/credit');
require('./tags/common/utils');
require('./tags/menu-list');
require('./tags/menu-popup');
require('./tags/common/footer-nav');

riot.route('/', () => {
	require('./tags/home');
	require('./tags/next');
	require('./tags/curfew');

	riot.mount('route', 'home');
});

riot.route('/archive/*/*', (year, month) => {
	require('./tags/archive');

	riot.mount('route', 'archive', {
		year,
		month
	});
});

riot.route('/search/*/*/*', (word, year, month) => {
	require('./tags/search');

	riot.mount('route', 'search', {
		word,
		year,
		month
	});
});

module.exports = {
	start: function() {
		riot.route.start(true);
	}
}
