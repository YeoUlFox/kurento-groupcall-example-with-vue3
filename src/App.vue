<template>
  <img id="logo" alt="logo" src="./assets/logo.png">

  <div id="join">
				<h1>Join a Room</h1>
				<form v-on:onsubmit.prevent="enterRoom()" accept-charset="UTF-8">
					<p>
						<input type="text" name="name" value="" id="name"
							placeholder="Username" required>
					</p>
					<p>
						<input type="text" name="room" value="" id="roomName"
							placeholder="Room" required>
					</p>
					<p class="submit">
						<input type="submit" name="commit" value="방 참여">
					</p>
				</form>
			</div>

			<div id="room" ref="div_room" v-if="isInRoom">
				<h2 id="room-header"> {{ roomname }} </h2>
				<div id="participants">
          <div v-for="()"> 
            <p> {{userName}} </p>
            <video ref="video-" + userName></video>
          </div>
        </div>
				<input type="button" id="button-leave" v-on:onmouseup="leaveRoom()"
					value="방 나가기">
			</div>

</template>

<script>
import { ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { Room } from '@/kurento/Room'

export default {
  name: 'Kurento_Demo',

  setup() {
    var store = useStore();

    var isInRoom = ref(false);
    var username = ref();
    var roomname = ref();

    function enterRoom() {
      store.state.room = Room();
      store.state.room.register(username.value, roomname.value);
      isInRoom.value = true;
    }

    
    function leaveRoom() {
      store.state.room.leaveRoom();
      isInRoom.value = false;
    }

    onBeforeUnmount(() => {
      // TODO : null check
      store.state.room.release();
    })

    return { username, roomname, isInRoom, enterRoom, leaveRoom }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#logo {
  height: 120px;
  width: 120px;
}
</style>
