<template>
  <img id="logo" alt="logo" src="./assets/logo.png">

  <!-- <button @click="test">test</button> -->

  <div id="join1" v-if="!isInRoom">
    <h1>Join a Room</h1>
    <form @submit.prevent="enterRoom()" accept-charset="UTF-8">
      <p>
        <input type="text" name="name" v-model="username" id="name"
          placeholder="Username" required>
      </p>
      <p>
        <input type="text" name="room" v-model="roomname" id="roomName"
          placeholder="Room" required>
      </p>
      <p class="submit">
        <input type="submit" name="commit" value="방 참여">
      </p>
    </form>
  </div>

  <div id="room" ref="div_room" v-if="isInRoom">
    <h2 id="room-header"> {{ roomname }} </h2>
    <div id="participants" ref="div_participants">
      <div v-for="[name, ] in room.participants" :key="name" :id="'participant' + name">
        <p> {{name}}</p>
      </div>
    </div>
    <input type="button" id="button-leave" @mouseup="leaveRoom()"
      value="방 나가기">
  </div>

</template>

<script>
import { ref, watch, onBeforeUnmount, onUpdated } from 'vue'
import { Room } from '@/kurento/Room'

export default {
  name: 'Kurento_Demo',

  setup() {
    var room = ref(new Room());
    var isInRoom = ref(false);
    var username = ref();
    var roomname = ref();

    

    function enterRoom() {
      room.value.register(username.value, roomname.value); 
      isInRoom.value = true;

      console.log("participants : " + room.value.participants);
    }

    function leaveRoom() {
      room.value.leaveRoom();
      isInRoom.value = false;


    }

    onUpdated(()=> {

    })

    var div_participants = ref(null);
    watch(room.value, (cur, old) => {
      console.log("watched!");
      console.log(cur);
      console.log(old);
    });
  
    // for page shut down
    onBeforeUnmount(() => { if(room.value != null) room.value.release(); })

    return { username, roomname, isInRoom, enterRoom, leaveRoom, div_participants, room}
  },
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
