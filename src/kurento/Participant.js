import { sendMessage } from "@/kurento/WebSocketHandler"

/**
 * WebRtc Participant
 * video DOM object name is defined as 'video-name'
 * @param {String} name
 */
export function Participant(name) {
	this.name = name;

	// var rtcPeer
	Object.defineProperty(this, 'rtcPeer', { writable: true });

	// create video
	var video = document.createElement('video');
	video.id = 'video-' + name;
	video.autoplay = true;
	video.controls = false;

	var rtcPeer;
	console.log(rtcPeer);
  
	this.getVideoElement = function () {
		return video;
	};

	this.offerToReceiveVideo = function(error, offerSdp){
		if (error) return console.error ("sdp offer error")
		console.log('Invoking SDP offer callback function');
		var msg =  { id : "receiveVideoFrom",
				sender : name,
				sdpOffer : offerSdp
			};
		sendMessage(msg);
	}

	this.onIceCandidate = function (candidate) {
			console.log("Local candidate" + JSON.stringify(candidate));

			var message = {
				id:	'onIceCandidate',
				candidate: candidate,
				name: name
			};
			sendMessage(message);
	}

	this.dispose = function() {
		console.log('Disposing participant ' + this.name);
		this.rtcPeer.dispose();

		// TODO : removing UI video is needed
		// container.parentNode.removeChild(container);
	};
}