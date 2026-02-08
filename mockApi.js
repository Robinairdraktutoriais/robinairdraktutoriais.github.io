function mockCheck(card) {
  return new Promise(resolve => {
    const delay =
      state.delayMin + Math.random() * (state.delayMax - state.delayMin);

    setTimeout(() => {
      const r = Math.random();
      if (r > 0.78) resolve({ status: "LIVE", msg: "Mock Approved" });
      else if (r > 0.12) resolve({ status: "DEAD", msg: "Mock Declined" });
      else resolve({ status: "ERROR", msg: "Timeout" });
    }, delay);
  });
}
