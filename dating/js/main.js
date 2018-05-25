//TODO need to show status if online or offile, and when connected online do an automatic search of the failed one
console.log('%c | ------------------------------------- |', 'background: #792e93; color: yellow; display: block;');
console.log('%c | upjoy.stream - a project by hackspree |', 'background: #792e93; color: yellow; display: block;');
console.log('%c | ------------------------------------- |', 'background: #792e93; color: yellow; display: block;');

$(document).ready(function () {
	// noty

	function nodify(type, text) {
		var n = noty({
			text        : text,
			type        : type,
			dismissQueue: true,
			layout      : 'topRight',
			//closeWith: ['click', 'hover'],
			theme       : 'relax',
			maxVisible  : 10,
			timeout: 5000,
			//modal: true,
			animation   : {
				open  : 'animated flipInX',
				close : 'animated flipOutX',
				speed : 500
			}
		});
		console.log('html: ' + n.options.id);
	};

	new Noty({
		text: 'NOTY - animating with Mo.js!',
		animation: {
			open: function (promise) {
				var n = this;
				var Timeline = new mojs.Timeline();
				var body = new mojs.Html({
					el        : n.barDom,
					x         : {500: 0, delay: 0, duration: 500, easing: 'elastic.out'},
					isForce3d : true,
					onComplete: function () {
						promise(function(resolve) {
							resolve();
						})
					}
				});

				var parent = new mojs.Shape({
					parent: n.barDom,
					width      : 200,
					height     : n.barDom.getBoundingClientRect().height,
					radius     : 0,
					x          : {[150]: -150},
					duration   : 1.2 * 500,
					isShowStart: true
				});

				n.barDom.style['overflow'] = 'visible';
				parent.el.style['overflow'] = 'hidden';

				var burst = new mojs.Burst({
					parent  : parent.el,
					count   : 10,
					top     : n.barDom.getBoundingClientRect().height + 75,
					degree  : 90,
					radius  : 75,
					angle   : {[-90]: 40},
					children: {
						fill     : '#EBD761',
						delay    : 'stagger(500, -50)',
						radius   : 'rand(8, 25)',
						direction: -1,
						isSwirl  : true
					}
				});

				var fadeBurst = new mojs.Burst({
					parent  : parent.el,
					count   : 2,
					degree  : 0,
					angle   : 75,
					radius  : {0: 100},
					top     : '90%',
					children: {
						fill     : '#EBD761',
						pathScale: [.65, 1],
						radius   : 'rand(12, 15)',
						direction: [-1, 1],
						delay    : .8 * 500,
						isSwirl  : true
					}
				});

				Timeline.add(body, burst, fadeBurst, parent);
				Timeline.play();
			},
			close: function (promise) {
				var n = this;
				new mojs.Html({
					el        : n.barDom,
					x         : {0: 500, delay: 10, duration: 500, easing: 'cubic.out'},
					skewY     : {0: 10, delay: 10, duration: 500, easing: 'cubic.out'},
					isForce3d : true,
					onComplete: function () {
						promise(function(resolve) {
							resolve();
						})
					}
				}).play();
			}
		}
	}).show();
	// noty ends



	//TODO this talks to the bots endpoint to get suggestions
	$('.autocomplete').autocomplete({
		data: {
			"Apple": null,
			"Aexaaaple": null,
			"Microsoft": null,
			"Google": 'http://placehold.it/250x250'
		}
	});



	// generic delay function to be used whenever it is needed
	/* delay(function(){
     code here
    }, 1000 );
    */
	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();
	// end of delay function


	// Bots API
	function bots(q){
		console.log("sending a query request for: " + q);
		$.ajax({
			url: "https://api.upjoy.stream/v1/bots",
			//url: "https://0.0.0.0/v1/bots",
			data: 'query=' + q,
			//data: 'query=' + q + '&bots=all',
			dataType: 'json',
			success: function (data) {
				// Show Query Stats
				$('#queryStats').empty().append("showing best <b>" + data.tpbbot.results_count + "</b> matching results for <b>" + data.query + "</b> in " + data.tpbbot.search_time + " secs");
				//data = JSON.parse(data);
				console.log(data);
				console.log(data.query);
				console.log(data.tpbbot);
				console.log(data.tpbbot.torrents[0]);

				var torrents = data.tpbbot.torrents;

				// Clears the slider from previous results
				$('#results').slick('unslick');
				$('#results').empty();
				initSlides();

				$.each (torrents, function (number) {
					console.log (number);
					console.log (torrents[number].name);
					torrent = torrents[number];
					// adds a slide per result
					//slideIndex++;
					$('#results').slick('slickAdd',
						'<div class="result">' + 
						'<div class="details">' + 
						'Name: ' + torrent.name + 
						' </br> Seeders: ' + torrent.seeders + ' </br> Size:' + torrent.total_size + ' </br> </br>' +
						'</div>' + 
						'<button id="' + torrent.name + '" class="magnet btn waves-effect waves-yellowish white" data-clipboard-text="' +  torrent.magnet_link  + '"> copy magnet </button>' +
						//'<a id= "' + number + '"class="show btn waves-effect waves-yellowish white modal-trigger" href="#theater" data-target="#theater">watch</a>'  +
						'</br> </br></div>');
					//console.log (a[bb].TEST1);
				});


				$('.show').on('click', function () {
					// Get the current slide
					//var currentSlide = $('#results').slick('slickCurrentSlide');
					console.log(this.id);
					console.log(torrents[this.id]);
					$('#theater').openModal();
				});  

				$('#results').append('</br>')
				$('#results').append('</br>')
				$('#tpbbot').empty().append("<b>" + data.tpbbot.torrents[0].name + "</b> </br>" );
				//$('.greeting-content').append(data.content);

				$('#query_done').get(0).volume=0.1;
				$('#query_done').get(0).play();
			},
		});
	};

	$("#search").trigger('autoresize').focus();

	var timerid;	
	$("#search").on("input",function(e){
		var value = $(this).val();
		if($(this).data("lastval")!= value){
			$(this).data("lastval",value);
			clearTimeout(timerid);
			timerid = setTimeout(function() {
				var q = $("#search").val();
				bots(q);
			},1000);
		};
	});
	// end of search functionality

	// blast https://codepen.io/sol0mka/pen/jAmNZm?editors=0010
	const COLORS = {
		RED:      '#FD5061',
		YELLOW:   '#FFCEA5',
		BLACK:    '#FCE205',
		WHITE:    'white',
		VINOUS:   '#A50710'
	}

	const bgBurst = new mojs.Burst({
		left: 0, top: 0,
		count:  3,
		radius: 0,
		degree: 0,
		isShowEnd: false,
		children: {
			fill:           [ COLORS.RED, COLORS.WHITE, COLORS.BLACK ],
			//radius:         'stagger(200, 2)',
			radius:         'stagger(5, 1)',
			scale:          { .25 : 3 },
			duration:       500,
			delay:          'stagger(50)',
			//easing:         [ 'cubic.out', 'cubic.out', 'cubic.out' ],
			easing:         [ 'cubic.out', 'cubic.in', 'cubic.in', 'cubic.out', 'cubic.out', 'cubic.out' ],
			isForce3d:      true,
		}
	});

	const burst1 = new mojs.Burst({
		left: 0, top: 0,
		count:    5,
		radius:   { 50: 250 },
		children: {
			fill:   'white',
			shape:  'line',
			stroke: [ COLORS.WHITE, COLORS.VINOUS ],
			strokeWidth: 12, 
			radius: 'rand(30, 60)',
			radiusY: 0,
			scale: { 1: 0 },
			pathScale: 'rand(.5, 1)',
			degreeShift: 'rand(-360, 360)',
			isForce3d: true,
		}
	});

	const burst2 = new mojs.Burst({
		top: 0, left: 0,
		count:  3,
		radius: { 0: 250 },
		children: {
			shape:      [ 'circle', 'rect' ],
			points:     5,
			fill:       [ COLORS.WHITE, COLORS.VINOUS ],
			radius:     'rand(30, 60)',
			scale:      { 1: 0 },
			pathScale:  'rand(.5, 1)',
			isForce3d:  true
		}
	});

	const CIRCLE_OPTS = {
		left: 0, top: 0,
		fill:     COLORS.WHITE,
		scale:    { .2: 1 },
		opacity: { 1: 0 },
		isForce3d: true,
		isShowEnd: false
	}

	const circle1 = new mojs.Shape({
		...CIRCLE_OPTS,
		//radius:   200,
		radius:   100,
	});

	const circle2 = new mojs.Shape({
		...CIRCLE_OPTS,
		//radius:   240,
		radius:   140,
		easing: 'cubic.out',
		delay: 150,
	});
	
	document.addEventListener( 'click', function (e) {
		//document.querySelector('#my-element');
		if (document.querySelector('.results').contains(event.target)) { 
		burst1
			.tune({ x: e.pageX, y: e.pageY })
			.generate()
			.replay();

		burst2
			.tune({ x: e.pageX, y: e.pageY })
			.generate()
			.replay();

		circle1
			.tune({ x: e.pageX, y: e.pageY })
			.replay();

		circle2
			.tune({ x: e.pageX, y: e.pageY })
			.replay();

		bgBurst
			.tune({ x: e.pageX, y: e.pageY })
			.replay();

			console.log('clicked inside results, show fun!'); } 
		else { 
			console.log('clicked outside results.'); 
		}
	});
	// https://github.com/legomushroom/mojs 
	// End of blast https://codepen.io/sol0mka/pen/jAmNZm?editors=0010

	// mojs icons
	// Checkpoint
	/* Icon 17 */
	// taken from mo.js demos 
	function isIOSSafari() { var userAgent; userAgent = window.navigator.userAgent; return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i); }; 
	// taken from mo.js demos 
	function isTouch() { var isIETouch; isIETouch = navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0; return [].indexOf.call(window, 'ontouchstart') >= 0 || isIETouch; }; 
	// taken from mo.js demos 
	var isIOS = isIOSSafari(), clickHandler = isIOS || isTouch() ? 'touchstart' : 'click';	
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}
	function Animocon(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );

		this.checked = false;

		this.timeline = new mojs.Timeline();

		for(var i = 0, len = this.options.tweens.length; i < len; ++i) {
			this.timeline.add(this.options.tweens[i]);
		}

		var self = this;
		this.el.addEventListener(clickHandler, function() {
			if( self.checked ) {
				self.options.onUnCheck();
				console.log('checked, so uncheck it');
			}
			else {
				self.options.onCheck();
				self.timeline.replay();
			}
			self.checked = !self.checked;
		});
				}
	//var el17 = document.querySelector('svg'); 
	var el17 = document.querySelector('button.icobutton'), el17SVG = el17.querySelector('svg');

	var translationCurve17 = mojs.easing.path('M0,100 C0,72 10,-0.1 50,0 C89.6,0.1 100,72 100,100'); 
	new Animocon(el17, { tweens : [ 
		// burst animation (line1) 
		new mojs.Burst({ parent: el17, left: '65%', top: '40%', count: 5, radius: {40:120}, angle: 69, degree: 17, children: { shape: 'line', scale: 1, radius: {20:0}, stroke: ['#bf62a6', '#f28c33', '#f5d63d', '#79c267', '#78c5d6'], duration: 600, easing: mojs.easing.bezier(0.1, 1, 0.3, 1) }, }), 
		// burst animation (circles) 
		new mojs.Burst({ parent: el17, left: '65%', top: '40%', count: 4, radius: {20:50}, degree: 20, angle: 70, opacity: 0.6, children: { fill: ['#bf62a6','#f28c33','#f5d63d','#79c267','#78c5d6'], scale: 1, radius: {'rand(5,20)':0}, isSwirl: true, swirlSize: 4, duration: 1600, delay: [0,350,200,150,400], easing: mojs.easing.bezier(0.1, 1, 0.3, 1) } }), 
		// icon scale animation 
		new mojs.Tween({ duration : 800, easing: mojs.easing.bezier(0.1, 1, 0.3, 1), onUpdate: function(progress) { var translationProgress = translationCurve17(progress); el17SVG.style.WebkitTransform = el17SVG.style.transform = 'translate3d(' + -20 * translationProgress + '%,0,0)'; } }) ], onCheck : function() { el17SVG.style.fill = '#F198CA'; }, onUnCheck : function() { el17SVG.style.fill = '#C0C1C3'; } }); /* Icon 17 */	
	//init();
	// end of mojs icons


	// hide scrollbars
	function reloadScrollBars() {
		document.documentElement.style.overflow = 'auto';  // firefox, chrome
		document.body.scroll = "yes"; // ie only
	}

	function unloadScrollBars() {
		document.documentElement.style.overflow = 'hidden';  // firefox, chrome
		document.body.scroll = "no"; // ie only
	}
	unloadScrollBars();

	// end of hide scrolbars cube

	// image cube

	var swiper = new Swiper('.swiper-container', {
		effect: 'cube',
		grabCursor: true,
		cubeEffect: {
			shadow: true,
			slideShadows: true,
			shadowOffset: 10,
			shadowScale: 0.2,
		},
		pagination: {
			el: '.swiper-pagination',
		},
		loop: true,
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
	});
	// end of image cube
});
