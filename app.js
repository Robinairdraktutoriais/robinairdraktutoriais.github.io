async function startChecker() {
  if (state.checking) return;
  state.checking = true;

  resetUI();

  const cards = document.getElementById("cards")
    .value
    .trim()
    .split("\n");

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
