function luhnCheck(card) {
  let sum = 0;
  let alternate = false;

  for (let i = card.length - 1; i >= 0; i--) {
    let n = parseInt(card.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function getBrand(card) {
  if (/^4/.test(card)) return "VISA";
  if (/^5[1-5]/.test(card)) return "MASTERCARD";
  if (/^3[47]/.test(card)) return "AMEX";
  if (/^6/.test(card)) return "ELO / DISCOVER";
  return "DESCONHECIDA";
}

function checkCards() {
  const input = document.getElementById("cards").value.trim();
  const result = document.getElementById("result");
  result.innerHTML = "";

  input.split("\n").forEach(line => {
    const [card, mm, yy, cvv] = line.split("|");

    if (!card || card.length < 13) {
      result.innerHTML += `<div class="dead">${line} ❌ FORMATO INVÁLIDO</div>`;
      return;
    }

    if (luhnCheck(card)) {
      result.innerHTML += `<div class="live">${line} ✅ Luhn OK | ${getBrand(card)}</div>`;
    } else {
      result.innerHTML += `<div class="dead">${line} ❌ Luhn FAIL</div>`;
    }
  });
}
