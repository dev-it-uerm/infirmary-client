export function setAppData(state, payload) {
  for (const key in payload) {
    state[key] = payload[key];
  }
}
