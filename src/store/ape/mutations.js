export function setConfig(state, payload) {
  state.config = payload;
}

export function setCampuses(state, payload) {
  state.campuses = payload[0];
  state.campusesMap = payload[1];
}
