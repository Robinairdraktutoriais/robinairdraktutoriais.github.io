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

async function checkCard(line) {
  const [cc] = line.split("|");

  if (!luhn(cc)) {
    state.dead++;
    return { status: "DEAD", msg: "Luhn Fail" };
  }

  return await mockCheck(cc);
}
