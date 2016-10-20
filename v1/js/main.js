$(document).ready(function () {

  // WebTorrent ------------------------ 
  //var torrentId = 'https://webtorrent.io/torrents/sintel.torrent'
  var torrentId = 'magnet:?xt=urn:btih:fe9922cd9cce5038a3948ea8fc8c49a1d9590cf7&dn=Nikola+Tesla%27s+Life+New+Documentary+Full.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'

  var client = new WebTorrent()

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
  // WebTorrent ends ------------------------ 
  //




  $( ".carousel-item" ).click(function() {
    event.stopPropagation();
    $('.carousel').carousel('next');
  });

  $("body").keydown(function(e){
    // left arrow
    if ((e.keyCode || e.which) == 37)
    {   
      $('.carousel').carousel('prev');
    }
    // right arrow
    if ((e.keyCode || e.which) == 39)
    {
      $('.carousel').carousel('next');
    }   
  });

  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();

  $('.carousel.carousel-slider').carousel({full_width: true});

  //TODO this talks to the bots endpoint to get suggestions
  $('.autocomplete').autocomplete({
    data: {
      "Apple": null,
      "Asple": null,
      "Axple": null,
      "Aale": null,
      "Aple": null,
      "Aaaaple": null,
      "Axaaaple": null,
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

  // search functionality
  function search(q){
    $.ajax({
      url: "http://localhost:9292/",
      data: "query=" + q + "&bots=all",
      success: function (data) {

	data = JSON.parse(data);
	console.log(data);
	console.log(data.query);
	console.log(data.tpbbot);
	console.log(data.tpbbot.torrents[0]);
	$('#query').empty().append("showing best <b>" + data.tpbbot.results_count + "</b> matching results for <b>" + data.query + "</b> in " + data.tpbbot.search_time + " secs");

	$('#results').empty();

	$('#results').append("<div class='carousel-item white black-text' href='#two!'><h2>2 Panel</h2> <p class='white-text'>This is your second panel</p> blah</div>" +  '<b>' + data.tpbbot.torrents[0].name + '</b> </br>' );

	// making the results look like those of the built-in autocomplete results.
	//$('.results').css({'font-size': '16px', 'color': '#26a69a', 'display': 'block', 'line-height': '22px'});

      },
    });
  };

/*
  $("#search").keyup(function(e){
    delay(function(){
      var q = $("#search").val();
      search(q);
    }, 1000 );
  });
*/

  $("#search").trigger('autoresize').focus();

  
  var timerid;	
  $("#search").on("input",function(e){
    var value = $(this).val();
    if($(this).data("lastval")!= value){
      $(this).data("lastval",value);

      clearTimeout(timerid);
      timerid = setTimeout(function() {

	var q = $("#search").val();
	search(q);

      },1000);

    };
  });

  // end of search functionality

});
