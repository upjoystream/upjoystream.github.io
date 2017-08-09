var internetradio = require('node-internet-radio');
var testStream = "http://us1.internet-radio.com:8321/listen.pls&t=.m3u";
internetradio.getStationInfo(testStream, function(error, station) {
	console.log(station);
});

const Vagalume = require('vagalume');
const vagalume = new Vagalume('apikey');

vagalume.artist('u2').then(response => {
	console.log(response.artist.id)
	//=> '3ade68b2g3b86eda3' 
})
