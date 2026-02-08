function updateStats() {
  live.textContent = state.live;
  dead.textContent = state.dead;
  error.textContent = state.error;
}

function resetUI() {
  state.live = state.dead = state.error = 0;
  logBox.innerHTML = "";
  updateStats();
}
