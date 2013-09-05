/* Author: Greg Opperman */

$(function () {
  $("#skip").click(function () {
    loadVideo($)
  })
  loadVideo($)
})

function vimeo_player_loaded(swf_id) {
  moogaloop = document.getElementById(swf_id);
  document.getElementById('controls').style.display = '';
  // moogaloop.api_addEventListener('onProgress', 'vimeo_on_progress');
  // moogaloop.api_addEventListener('onLoading',  'vimeo_on_loading');
  moogaloop.api_addEventListener('onFinish',   'vimeo_on_finish');
  moogaloop.api_addEventListener('onPlay',     function () { console.log("playin"); } );
  // moogaloop.api_addEventListener('onPause',    'vimeo_on_pause');
  // moogaloop.api_addEventListener('onSeek',     'vimeo_on_seek');

  // document.getElementById('vimeo_duration').innerHTML = moogaloop.api_getDuration();
}

function vimeo_on_finish(swf_id) {
  document.getElementById('state').innerHTML = 'Finished';
}

function onPlayerStateChange(newState) {
	console.log(newState);
	if (newState == 0) {
		loadVideo();
		console.log("done");
	}
}

function onYouTubePlayerReady(playerId) {
  ytplayer = document.getElementById("player");
  ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
}

function loadVideo () {
	jQuery.getJSON('/next_video.json').done(function (data) {
    console.log(data)
    var player_id = "container"
    var url = ""

		if (data.src == 'youtube') {
      url = build_youtube_url(data.id)

      swfobject.embedSWF(url, player_id, "100%", "100%", "9", null, null,
                                       {
                                         allowScriptAccess: "always",
                                         wmode:             "opaque"
                                       },
                                       { id: player_id })
		}
    else if (data.src == 'vimeo') {
      // url = build_vimeo_url(data.id)

		  var video_id = 4632707;
      var moogaloop = false;

      var flashvars = {
        clip_id: data.id,
        show_portrait: 1,
        show_byline: 1,
        show_title: 1,
        js_api: 1, // required in order to use the Javascript API
        js_onLoad: 'vimeo_player_loaded', // moogaloop will call this JS function when it's done loading (optional)
        js_swf_id: 'moogaloop' // this will be passed into all event methods so you can keep track of multiple moogaloops (optional)
      };

      var params = {
        allowscriptaccess: 'always',
        allowfullscreen: 'true'
      };

      var attributes = {};

		  // For more SWFObject documentation visit: http://code.google.com/p/swfobject/wiki/documentation
		  swfobject.embedSWF("http://vimeo.com/moogaloop.swf", player_id, "504", "340", "9.0.0","expressInstall.swf", flashvars, params, attributes);
		}
    else {
      console.log("unknown src spec")
    }

	});
}

var build_youtube_url = function (id) {
  return "http://www.youtube.com/v/" + id +
         "?version=3&enablejsapi=1&playerapiid=player1" +
         "&iv_load_policy=3&autoplay=1&controls=0&wmode=opaque"
}

// var build_vimeo_url = function (id) {
//   return "http://vimeo.com/moogaloop.swf?clip_id=" + id +
//          "&server=vimeo.com&show_title=0&show_byline=0" +
//          "&show_portrait=0&color=ffffff&fullscreen=1" +
//          "&autoplay=0&loop=0&js_onload=vimeo_loaded"
// }