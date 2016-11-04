btn

	button.btn(type="button" onclick="{onClick}")
		span.icon
			span(each="{icon in opts.icons}" class="ion-{icon}")
		| {opts.text}

	script.
		var anime = require('animejs');

		this.onClick = function() {
			// スムーススクロール
			if(opts.scroller) {
				if(!opts.scroller.target) return;
				var target = opts.scroller.target;
				var duration = opts.scroller.duration || 200;
				var offset = opts.scroller.offset || 0;
				var callback = opts.scroller.callback;
				var $target = document.getElementById(target);
				if(!$target) return;
				var pos = $target.getBoundingClientRect().top + offset;
				var pageY = window.pageYOffset;
				var pageX = window.pageXOffset;
				// アニメーション
				anime({
					duration: duration,
					easing: 'easeOutCubic',
					update: function(step) {
						console.log(step.currentTime, step.duration, step.ended, step.progress);
						window.scrollTo(pageX, pageY + pos * step.progress / 100)
					}
				});
			}
			// リンク
			if(opts.href) {
				location.href = opts.href;
			}
		}

	style(type="sass" scoped).
		.btn
			display: block
			width: 98%
			height: 40px
			margin: 10px auto
			position: relative
			border: 1px solid  #ccc
			border-radius: 15px
			background-image: -webkit-linear-gradient(#fdfdfd, #f1f1f1)
			background-image: -o-linear-gradient(#fdfdfd, #f1f1f1)
			background-image: linear-gradient(#fdfdfd, #f1f1f1)
			box-shadow: 0 2px 3px #ccc
			line-height: 40px
			color: #2e3436
			text-decoration: none
			text-align: center
			font-weight: bold
			font-size: 100%
			outline: none
			cursor: pointer
			-webkit-tap-highlight-color: rgba(#000,0) !important
			&:hover
				background-image: -webkit-linear-gradient(#f8f8f8, #e1e1e1)
				background-image: -o-linear-gradient(#f8f8f8, #e1e1e1)
				background-image: linear-gradient(#f8f8f8, #e1e1e1)
			&:active
				background-image: -webkit-linear-gradient(#d1d1d1, #dfdfdf)
				background-image: -o-linear-gradient(#d1d1d1, #dfdfdf)
				background-image: linear-gradient(#d1d1d1, #dfdfdf)
			.icon
				position: absolute
				top: 0
				left: 5px
				width: 40px
				height: 40px
				line-height: 40px
				text-align: center
				font-size: 25px
				color: #939393
				& > span:nth-child(2)
					margin-left: 5px
