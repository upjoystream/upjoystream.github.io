//TODO need to show status if online or offile, and when connected online do an automatic search of the failed one

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
      timeout: 2000,
      //modal: true,
      animation   : {
	open  : 'animated flipInX',
	close : 'animated flipOutX',
	speed : 500
      }
    });
    console.log('html: ' + n.options.id);
  }


  // noty ends


  // scroll the results
  $('#results').on('mousewheel', function(event) {
    //console.log(event.deltaX, event.deltaY, event.deltaFactor);
    window.onwheel = function(){ return false; }
    if (event.deltaY === +1) {
      $('#results').slick("slickNext");
    };
    if (event.deltaY === -1) {
      $('#results').slick("slickPrev");
    };
  });

  // copy paste magnet

  var clipboard = new Clipboard('.btn', {
    text: function(trigger) {
      return trigger.getAttribute('id');
    }
  });

  clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    nodify('', "COPIED " + e.text);
    e.clearSelection();
  });

  // copy the magnet
  new Clipboard('.btn');
  // copy paste magnet end

  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();

  // prevent textbox from being affected by navigation
  //$(document).keydown(function (e) {
  // var element = e.target.nodeName.toLowerCase();
  //if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly") || (e.target.getAttribute("type") ==="checkbox")) {
  // if (e.keyCode === 8) {
  //	return false;
  //     }
  //   }
  //   // makes search gets focused whenever there is a keydown
  //  $("#search").focus();
  // });

  $("body").keydown(function(e){
    var element = e.target.nodeName.toLowerCase();
    if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly") || (e.target.getAttribute("type") ==="checkbox")) {
      $("#search").focus();
    }

    switch(e.which) {
      case 37: // left
	$('#results').slick("slickPrev");
	break;

      case 38: // up
	$('#results').slick("slickNext");
	break;

      case 39: // right
	$('#results').slick("slickNext");
	break;

      case 40: // down
	$('#results').slick("slickPrev");
	break;

      default: return; // exit this handler for other keys
    }

    e.preventDefault(); // prevent the default action (scroll / move caret)
  });


  //$('.carousel.carousel-slider').carousel({full_width: true});

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

  var slider = $('#results');
  // Slides
  function initSlides(){
    slider.slick({
      arrows: false,
      dots: true,
      speed: 300,
      fade: false,
      lazyLoad: 'ondemand',

      // it fucksup the modal calls as it returns undefined between cycle-end\cycle-start(just don't use it)
      centerMode: false,
      infinite: false, 

      slidesToShow: 3,
      slidesToScroll: 3,

      autoplay: true,
      //autoplay: false,
      autoplaySpeed: 8000,
      pauseOnHover: true,

      accessibility: true,
      cssEase: 'linear',

      swipe: true,
      swipeToSlide: true,
      touchMove:true

    });
  };

  // Initiate the slides
  initSlides();


  // On before slide change
  $('#results').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    // can be used as torrents[nextSlide] to get the choice of the result and send it to WATCH 
    console.log(nextSlide);
  });


});

// HACKS here
//
//
//
//
// WebTorrent ------------------------ 
var torrentId = 'fe9922cd9cce5038a3948ea8fc8c49a1d9590cf7'
var torrentId = 'https://webtorrent.io/torrents/sintel.torrent'
var torrentId = "magnet:?xt=urn:btih:4627721f1ce03613d7f1ace63ec20cadc612c130&dn=Dirty%20Masseur%2012%20%28Brazzers%29%20%E2%9C%A6%20NEW%20%E2%9C%A6%202016%20%2C%20WEB-DL%20Split%20Scenes&&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fzer0day.to%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce"

var torrentId = "0797d5d4396f39414b960392f702d2422dfd88aa"

var opts = {
  //maxConns: Number,        // Max number of connections per torrent (default=55)
  //nodeId: String|Buffer,   // DHT protocol node ID (default=randomly generated)
  //peerId: String|Buffer,   // Wire protocol peer ID (default=randomly generated)
  //tracker:  //Boolean|Object, // Enable trackers (default=true), or options object for Tracker
  //dht: Boolean|Object,     // Enable DHT (default=true), or options object for DHT
  //webSeeds: Boolean        // Enable BEP19 web seeds (default=true)
  //announce: ['wss://tracker.openwebtorrent.com'], // list of tracker server urls
}

var client = new WebTorrent(opts)
client.tracker = ['wss://tracker.openwebtorrent.com', 'wss://tracker.btorrent.xyz', 'wss://tracker.fastcast.nz']
console.log(client.tracker)

// HTML elements
var $body = document.body
var $progressBar = document.querySelector('#progressBar')
var $numPeers = document.querySelector('#numPeers')
var $downloaded = document.querySelector('#downloaded')
var $total = document.querySelector('#total')
var $remaining = document.querySelector('#remaining')
var $uploadSpeed = document.querySelector('#uploadSpeed')
var $downloadSpeed = document.querySelector('#downloadSpeed')

// Download the torrent
client.add(torrentId, function (torrent) {

  // as per https://github.com/feross/webtorrent/issues/218
  // shouldn't it be an array of trackers?
  //announce: 'wss://tracker.webtorrent.io'

  // Stream the file in the browser
  torrent.files[0].appendTo('#output')

  // Trigger statistics refresh
  torrent.on('done', onDone)
  setInterval(onProgress, 500)
  onProgress()

  // Statistics
  function onProgress () {
    // Peers
    $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

    // Progress
    var percent = Math.round(torrent.progress * 100 * 100) / 100
    $progressBar.style.width = percent + '%'
    $downloaded.innerHTML = prettyBytes(torrent.downloaded)
    $total.innerHTML = prettyBytes(torrent.length)

    // Remaining time
    var remaining
    if (torrent.done) {
      remaining = 'Done.'
    } else {
      remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
      remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
    }
    $remaining.innerHTML = remaining

    // Speed rates
    $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
    $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
  }
  function onDone () {
    $body.className += ' is-seed'
    onProgress()
  }
})

// Human readable bytes util
function prettyBytes(num) {
  var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  if (neg) num = -num
  if (num < 1) return (neg ? '-' : '') + num + ' B'
  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]
  return (neg ? '-' : '') + num + ' ' + unit
}
console.log(client)

// WebTorrent ends ------------------------ 
//


/*
 *	var items = [];
	$.each(data.tpbbot.torrents, function( key, val ) {
	  items.push( "<li id='" + key + "'>" + val.name + "</li>" );
	});


	console.log(data);
	console.log(data.query);
	console.log(data.tpbbot);
	console.log(data.tpbbot.torrents);
	console.log(data.tpbbot.torrents[0]);

  $("#search").keyup(function(e){
    delay(function(){
      var q = $("#search").val();
      search(q);
    }, 1000 );
  });


	$( "<div/>", {
	  "class": 'carousel-item white black-text',
	  "href":"#one",
	  "html": "very l#$#@@$@$@$@$@$@$@$@ong long long secret" + items.join( "" )
	}).appendTo( "#results" );

*/
