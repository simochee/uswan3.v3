footer-nav
	
	btn(icons="{['ios-calendar-outline']}" text="過去の献立" onclick="{toggleArchiveList}")

	.archive-list#archiveList
		ol
			li(each="{item in archive}" if="{!(item.year == u.now.year && item.month == u.now.month)}")
				btn(href="#/archive/{item.year}/{item.month}" text="{item.year}年{item.month}月")

	

	script.
		var anime = require('animejs');
		var api = require('../../api');
		var self = this;

		self.u = require('../../utils');

		api.archive().then(function(data) {
			self.archive = data.items;
			self.archiveCount = data.count;
			self.update();
		});

		self.isOpen = {
			calendar: false
		}

		self.on('mount', function() {
			var $list = document.getElementById('archiveList');
			var isArchiveOpen = false;
			self.toggleArchiveList = function() {
				anime({
					targets: $list,
					duration: 300,
					easing: 'easeOutQuad',
					height: isArchiveOpen ? 0 : (self.archiveCount - 1) * 55,
					opacity: isArchiveOpen ? 0 : 1
				});
				isArchiveOpen = ~isArchiveOpen;
			}
		});

	style(type="sass" scoped).
		.archive-list
			overflow: hidden
			height: 0
			opacity: 0
			ol
				margin: -10px 3% 0
