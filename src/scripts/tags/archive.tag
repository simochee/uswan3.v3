archive
	#blur
		navbar

		btn(href="#" text="今月の献立")

		menu-list(year="{year}" month="{month}")

		footer-nav

		credit

	menu-popup

	script.
		this.year = opts.year;
		this.month = opts.month;