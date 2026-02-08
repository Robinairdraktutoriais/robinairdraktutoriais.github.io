let live = 0, dead = 0, error = 0;

function luhn(card) {
  let s = 0, a = false;
  for (let i = card.length - 1; i >= 0; i--) {
    let n = parseInt(card[i]);
    if (a) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    s += n;
    a = !a;
  }
  return s % 10 === 0;
}

// 🔹 API MOCK
function fakeApi(card) {
  return new Promise(resolve => {
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const rand = Math.random();
      if (rand > 0.75) resolve("LIVE");
      else if (rand > 0.15) resolve("DEAD");
      else resolve("ERROR");
    }, delay);
  });
}

async function startChecker() {
  live = dead = error = 0;
  updateStats();
  document.getElementById("log").innerHTML = "";

  const lines = document.getElementById("cards").value.trim().split("\n");

  for (const line of lines) {
    if (!line) continue;

    const [cc] = line.split("|");

    if (!luhn(cc)) {
      dead++;
      log(line, "DEAD | Luhn Fail", "dead");
      continue;
    }

    log(line, "Checking...", "error");

    const res = await fakeApi(cc);

    if (res === "LIVE") {
      live++;
      log(line, "LIVE | Mock Approved", "live");
    } else if (res === "DEAD") {
      dead++;
      log(line, "DEAD | Mock Declined", "dead");
    } else {
      error++;
      log(line, "ERROR | Timeout", "error");
    }

    updateStats();
  }
}

function log(card, msg, cls) {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = `${card} ➜ ${msg}`;
  document.getElementById("log").appendChild(div);
}

function updateStats() {
  document.getElementById("live").textContent = live;
  document.getElementById("dead").textContent = dead;
  document.getElementById("error").textContent = error;
}
