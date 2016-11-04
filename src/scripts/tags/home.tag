home

	#blur
		navbar

		next
		footer-nav

		btn(icons="{['fork', 'knife']}" text="今日の献立" scroller="{scrollerOpts}")

		menu-list(year="{year}" month="{month}")


		credit

	menu-popup

	script.
		var self = this;

		var d = new Date;
		self.year = d.getFullYear();
		self.month = d.getMonth() + 1;

		self.scrollerOpts = {
			target: 'today',
			duration: 300
		}