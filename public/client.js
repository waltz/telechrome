// Initialize the video player on document load and wire up the skip button.
$(function () {
  $("#skip").click(function () {
    loadVideo($)
  })
  loadVideo($)

  // Listen for Vimeo player events.
  window.addEventListener('message', function (message) {
    console.log('Got a message from the Vimeo player.');
    console.log(message);
    var data = JSON.parse(message.data)

    if (data.event === 'ready') {
      console.log("Vimeo player is ready.")
      var iframe = $("#" + data.player_id)[0]
      var player = $f(iframe)
      player.addEvent('finish', function () { loadVideo() })
      player.api('play')
    }
  }, false);
})

// Handle YouTube player state changes.
function onPlayerStateChange (newState) {
	console.log("current state is: " + newState);
	if (newState == 0) {
		loadVideo();
		console.log("new video loaded");
	}
}

// Attach a state change event handler when the YouTube player is ready.
function onYouTubePlayerReady () {
  console.log("player ready");
  ytplayer = $("#container")[0];
  ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
}

function loadVideo () {
	$.getJSON('/next_video.json').done(function (data) {
    // data = { src: "vimeo", id: "64978838", title: "Glory Days" }; // Vimeo test.

    console.log("Currently playing: " + JSON.stringify(data));

    var container_id = "container",
        url       = "";

		if (data.src == 'youtube') {
      url = "http://www.youtube.com/v/" + data.id +
            "?version=3&enablejsapi=1&playerapiid=player1" +
            "&iv_load_policy=3&autoplay=1&controls=0&wmode=opaque";
      swfobject.embedSWF(url, container_id, "100%", "100%", "9", null, null,
                                       {
                                         allowScriptAccess: "always",
                                         wmode:             "opaque"
                                       },
                                       { id: container_id });
		}
    else if (data.src == 'vimeo') {
      url = "http://player.vimeo.com/video/" + data.id + "?api=1&player_id=vimeo_player"
      $("#" + container_id).html('<iframe id="vimeo_player" src="' + url + '" width="100%" height="100%" frameborder="0"></iframe>')
		}
    else {
      console.log("unknown src spec")
    }

	});
}
