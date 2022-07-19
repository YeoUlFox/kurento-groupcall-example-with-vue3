import useStore from "vuex";

/**
 * Access room object in store and send message
 * @param {String} message 
 */
export function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    
    const ws = useStore().state.room.ws || {};
    (ws.length == 0)? (ws.send(jsonMessage)):(console.log("ws is not initialized"));
}