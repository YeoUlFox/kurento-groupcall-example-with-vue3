<template>
  <img id="logo" alt="logo" src="./assets/logo.png">

  <button @click="test">test</button>

  <p v-if="!isConnected"> Web Socket Not Connected </p>
  <p> total members : {{ Object.keys(participants).length }} </p>

  <div id="join1" v-if="isConnected">
    <h1>Join a Room</h1>
    <form @submit.prevent="register()" accept-charset="UTF-8">
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

  <div id="room" ref="div_room" v-if="Object.keys(participants).length != 0">
    <h2 id="room-header"> Room : {{ roomname }} </h2>
    <div id="participants" ref="div_participants">
      <div v-for="(value, name) in participants" :key="name" :ref="(el) => { members[name] = el }">
        <p>{{name}}</p>
      </div>
    </div>
    <input type="button" id="button-leave" @mouseup="leaveRoom()"
      value="방 나가기">
  </div>

</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, onUpdated} from 'vue'
import { useStore } from 'vuex';

export default {
  name: 'Kurento_Demo',

  setup() {
    var store = useStore();

    var username = ref();
    var roomname = ref();

    function test() {
      console.log(store.state.Room.participants);
    }

    function register() {
      store.dispatch("register", { username: username.value, roomname: roomname.value });
      // TODO : update UI
    }

    function leaveRoom() {
      store.dispatch("leaveRoom");
      // TODO : update UI
    }

    function unLoadEvent(event) {
      store.commit("closeSocket");
      event.preventDefault();
      event.returnValue = "";
    }

    onMounted(() => {
      // add event for leaving this page
      window.addEventListener('beforeunload', unLoadEvent);

      // start socket connection
      store.commit("initSocket");
    })

    onBeforeUnmount(() => {
      // remove event
      window.removeEventListener('beforeunload', unLoadEvent);
    })

    // add video on updated participants
    var members = ref({});
    onUpdated(() => {
      Object.keys(members.value).forEach((key) => {
        console.log(key + " : " + members.value[key]);

        if(members.value[key].children.length > 1) {
          console.log("dd");
          return;
        }
          

        let video = store.state.Room.participants[key].getVideoElement();
        members.value[key].appendChild(video);
      })
    })

    // watch(() => store.state.Room.participants, function(cur, old) {
    //   // find newly added keys
    //   let cur_key = Object.keys(cur);
    //   let old_key = Object.keys(old);
    //   console.log("watched " + cur_key + " -> " + old_key);
    // })

    return { username, roomname, register, leaveRoom, test,
      members,
      participants: computed(() => store.state.Room.participants),
      isConnected: computed(() => store.state.Room.isSocketConnected)}
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
