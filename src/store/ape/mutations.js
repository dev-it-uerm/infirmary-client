export function setAppData(state, payload) {
  for (const key in payload) {
    state[key] = payload[key];
  }
}

export function setExams(state, payload) {
  state.exams = payload[0];
  state.examsMap = payload[1];
}
