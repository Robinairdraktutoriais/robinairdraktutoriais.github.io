const cardsInput = document.getElementById("cards");

const liveEl = document.getElementById("live");
const deadEl = document.getElementById("dead");
const errorEl = document.getElementById("error");

const logLive = document.getElementById("log-live");
const logDead = document.getElementById("log-dead");
const logError = document.getElementById("log-error");

function updateStats() {
  liveEl.textContent = state.live;
  deadEl.textContent = state.dead;
  errorEl.textContent = state.error;
}

function resetUI() {
  state.live = 0;
  state.dead = 0;
  state.error = 0;

  logLive.innerHTML = "";
  logDead.innerHTML = "";
  logError.innerHTML = "";

  updateStats();
}

function log(card, msg, status) {
  const div = document.createElement("div");
  div.textContent = `${card} ➜ ${msg}`;
  div.className = status;

  if (status === "live") logLive.appendChild(div);
  if (status === "dead") logDead.appendChild(div);
  if (status === "error") logError.appendChild(div);
}

async function startChecker() {
  if (state.checking) return;
  state.checking = true;

  resetUI();

  const cards = cardsInput.value.trim().split("\n");

  for (const line of cards) {
    if (!line) continue;

    log(line, "Checking...", "error");

    const res = await checkCard(line);

    if (res.status === "LIVE") state.live++;
    if (res.status === "DEAD") state.dead++;
    if (res.status === "ERROR") state.error++;

    log(line, `${res.status} | ${res.msg}`, res.status.toLowerCase());
    updateStats();
  }

  state.checking = false;
}
