var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remoteVideos',
    // immediately ask for camera access
    autoRequestMedia: true,

    var stun = {url:'stun:stunserver.org'}

    var turn = {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }

    peerConnectionConfig: {
      iceServers: [stun, turn]
    }

    // peerConnectionConfig: {
    //   iceServers: [ {
    //     url:'stun:stunserver.org'}, {
    //       url: 'turn:192.158.29.39:3478?transport=tcp',
    //       credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    //       username: '28224511:1379330808'
    //     }
    //   ]}

    // var stun = {
    //   'url': 'stun:myserver.com:3478'
    // };
    //
    // var turn = {
    //   'url': 'turn:myserver.com:3478',
    //   'username': 'mysuser@myrealm',
    //   'credential': 'mypassword'
    // };
    //
    // peerConnectionConfig: { 'iceServers': [stun, turn] }


});

// we have to wait until it's ready
webrtc.on('readyToCall', function () {
    // you can name it anything
    webrtc.joinRoom('your awesome room name');
});

// a peer video has been added
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('remotes');
    if (remotes) {
        var container = document.createElement('div');
        container.className = 'videoContainer';
        container.id = 'container_' + webrtc.getDomId(peer);
        container.appendChild(video);

        // suppress contextmenu
        video.oncontextmenu = function () { return false; };

        remotes.appendChild(container);
    }
});

// a peer video was removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementById('remotes');
    var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
        remotes.removeChild(el);
    }
});


// function initFullScreen() {
//   var button = document.getElementById("fullscreen");
//   button.addEventListener('click', function(event) {
//     var elem = document.getElementById("videos");
//     //show full screen
//     elem.webkitRequestFullScreen();
//   });
// }

// var peervids = document.getElementById('remoteVideos').children;
// console.log(peervids);
// var peervidlen = peervids.length;
// console.log(peervidlen);
// var peerdiv = document.getElementById('peer-vid-len');
// console.log(peerdiv);
// peerdiv.innerHTML = peervidlen;
