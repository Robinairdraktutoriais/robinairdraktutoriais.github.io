function luhn(card) {
  let sum = 0;
  let alt = false;

  for (let i = card.length - 1; i >= 0; i--) {
    let n = parseInt(card[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

async function checkCard(line) {
  const [cc] = line.split("|");

  if (!cc || !luhn(cc)) {
    return { status: "DEAD", msg: "Luhn Fail" };
  }

  return await mockCheck(cc);
}
