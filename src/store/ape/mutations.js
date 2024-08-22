export function setDepartments(state, val) {
  state.departments = val[0];
  state.departmentsMap = val[1];
}

export function setExams(state, val) {
  state.exams = val[0];
  state.examsMap = val[1];
}
