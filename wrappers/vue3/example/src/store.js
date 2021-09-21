import {createStore} from "vuex";

export default createStore({
  state: {
    activeColors: [],
    inactiveColors: []
  },
  mutations: {
    initStarColors(state, hotData) {
      for (var i = 0; i < hotData.length; i++) {
        state.activeColors[i] = hotData[i][1];
        state.inactiveColors[i] = hotData[i][2];
      }
    },
    setActiveStarColor(state, payload) {
      Vue.set(state.activeColors, payload.row, payload.newColor);
    },
    setInactiveStarColor(state, payload) {
      Vue.set(state.inactiveColors, payload.row, payload.newColor);
    }
  }
});
