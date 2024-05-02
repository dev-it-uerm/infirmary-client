import { buildHashTable } from "src/helpers/util";

export function setUser(state, payload) {
  state.user = payload;
}

export function setDiagnostics(state, payload) {
  state.diagnostics = payload;
}

export function setDiagnosticCenters(state, payload) {
  state.diagCenters = payload;
  state.diagCentersMap = buildHashTable(payload, "code");
}
