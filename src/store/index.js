import { createStore } from "vuex";

export default createStore({
  state: {
    room : {},
  },

  getters: {
    getWebSocket(state) {
      return (state.room.length == 0)?({}):(state.room.ws);
    },

    getParticipants(state) {
      return (state.room.length == 0)?({}):(state.room.participants);
    }
  }
});