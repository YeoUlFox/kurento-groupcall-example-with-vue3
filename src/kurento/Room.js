import { sendMessage } from "@/kurento/WebSocketHandler"
import { Participant } from '@/kurento/Participant'
import { WebRtcPeer } from "kurento-utils";


export function Room() {
	var ws = new WebSocket('wss://' + location.host + '/groupcall');
	var participants = {};

	var userName;
	var roomName;

	// window.onbeforeunload = function() {
	// 	ws.close();
	// };
	this.release = function() {
		ws.close();
	}

	ws.onmessage = function(message) {
		var parsedMessage = JSON.parse(message.data);
		console.info('Received message: ' + message.data);
	
		switch (parsedMessage.id) {
		case 'existingParticipants':
			onExistingParticipants(parsedMessage);
			break;
		case 'newParticipantArrived':
			onNewParticipant(parsedMessage);
			break;
		case 'participantLeft':
			onParticipantLeft(parsedMessage);
			break;
		case 'receiveVideoAnswer':
			receiveVideoResponse(parsedMessage);
			break;
		case 'iceCandidate':
			participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
				if (error) {
					console.error("Error adding candidate: " + error);
					return;
				}
			});
			break;
		default:
			console.error('Unrecognized message', parsedMessage);
		}
	}

	this.register = function(user, room) {
		// name = document.getElementById('name').value;
		// var room = document.getElementById('roomName').value;
	
		// document.getElementById('room-header').innerText = 'ROOM ' + room;
		// document.getElementById('join').style.display = 'none';
		// document.getElementById('room').style.display = 'block';

		userName = user;
		roomName = room;
	
		var message = {
			id : 'joinRoom',
			name : userName,
			room : roomName,
		}
		sendMessage(message);
	}

	// SDP Answer에 대한 처리
	this.callResponse = function(message) {
		if (message.response != 'accepted') {
			console.info('Call not accepted by peer. Closing call');
			stop();
		} else {
				// TODO : webRtcPeer -> WebRtcPeer
				WebRtcPeer.processAnswer(message.sdpAnswer, function (error) {
				if (error) return console.error (error);
			});
		}
	}

	this.leaveRoom = function() {
		sendMessage({
			id : 'leaveRoom'
		});
	
		for ( var key in participants) {
			participants[key].dispose();
		}

		ws.close();
	}


	function onExistingParticipants(msg) {
		var constraints = {
			audio : true,
			video : {
				mandatory : {
					maxWidth : 320,
					maxFrameRate : 15,
					minFrameRate : 15
				}
			}
		};
		console.log(userName + " registered in room " + roomName);

		var participant = new Participant(userName);
		participants[userName] = participant;
		var video = participant.getVideoElement();
	
		var options = {
				localVideo: video,
				mediaConstraints: constraints,
				onicecandidate: participant.onIceCandidate.bind(participant)
			}
		participant.rtcPeer = new WebRtcPeer.WebRtcPeerSendonly(options,
			function (error) {
				if(error) {
					return console.error(error);
				}
				this.generateOffer (participant.offerToReceiveVideo.bind(participant));
		});
	
		msg.data.forEach(receiveVideo);
	}

	function onNewParticipant(request) {
		receiveVideo(request.name);
	}

	function onParticipantLeft(request) {
		console.log('Participant ' + request.name + ' left');
		var participant = participants[request.name];
		participant.dispose();
		delete participants[request.name];
	}

	function receiveVideoResponse(result) {
		participants[result.name].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
			if (error) return console.error (error);
		});
	}

	function receiveVideo(sender) {
		var participant = new Participant(sender);
		participants[sender] = participant;
		var video = participant.getVideoElement();
	
		var options = {
			remoteVideo: video,
			onicecandidate: participant.onIceCandidate.bind(participant)
		}
	
		participant.rtcPeer = new WebRtcPeer.WebRtcPeerRecvonly(options,
				function (error) {
					if(error) {
						return console.error(error);
					}
					this.generateOffer (participant.offerToReceiveVideo.bind(participant));
		});
	}
}