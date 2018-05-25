function streamSelected(msg) {
    console.log( msg + ' - stream was selected' );
    //return msg;
}

function addLyrics() {
    var scrollbox = document.getElementById('lyricsBox');
    // Create some element, e.g. div
    var newElement = document.createElement('div');
    newElement.setAttribute('id', "lyrics");
    newElement.innerHTML = '<div class="fleft"><h1>Lyrics added!</h1></div>';
    scrollbox.appendChild(newElement);
}

function addTrans() {
    var scrollbox = document.getElementById('lyricsBox');
    // Create some element, e.g. div
    var newElement = document.createElement('div');
    newElement.setAttribute('id', "trans");
    newElement.innerHTML = '<div class="fright"><h1>Trans added!</h1></div>';
    scrollbox.appendChild(newElement);
}


// Called each time the slide with the "stats" state is made visible
Reveal.addEventListener( 'mainSlide', function() {
    console.log( '"mainSlide" has fired' );
} );

// Called each time the slide with the "stats" state is made visible
Reveal.addEventListener( 'streamSlide', function() {
    console.log( '"streamSlide" has fired' );
    msg="somthing from another function";
    streamSelected(msg);
    // clear the lyricsBox from potionially recent content
    // $("#lyricsBox").html("");
    document.getElementById("lyricsBox").innerHTML =
        "<h6>Channel Name - Song Name</h6>" + 
        "Song Info - Original Lyrics" + 
        " Translation in scrollable box sidebyside" +
        "</br> </br>";
    // Fire the third-party APIs
    addLyrics();
    addTrans();
} );
