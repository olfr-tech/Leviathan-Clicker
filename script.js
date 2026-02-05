const clickerButton = document.getElementById("clicker");
const mustardCount = document.getElementById("mustard-count");
const mpsCount = document.getElementById("mps-count");
const lifetimeCount = document.getElementById("lifetime-count");
const upgradeList = document.getElementById("upgrade-list");
const resetButton = document.getElementById("reset");

const upgrades = [
  {
    id: "squeeze",
    name: "Extra Squeeze Bottle",
    description: "Sharper squeeze means more mustard per click.",
    baseCost: 25,
    mps: 0,
    clickBoost: 1,
  },
  {
    id: "roller",
    name: "Mustard Roller",
    description: "A steady drip of mustard all day long.",
    baseCost: 75,
    mps: 1,
    clickBoost: 0,
  },
  {
    id: "stand",
    name: "Leviathan Hot Dog Stand",
    description: "Hire a crew to serve mustard at scale.",
    baseCost: 300,
    mps: 6,
    clickBoost: 0,
  },
  {
    id: "factory",
    name: "Mustard Forge",
    description: "Industrial vats of legendary mustard.",
    baseCost: 1200,
    mps: 18,
    clickBoost: 0,
  },
  {
    id: "fleet",
    name: "Leviathan Fleet",
    description: "Hot dog ships harvesting oceans of mustard.",
    baseCost: 5000,
    mps: 55,
    clickBoost: 0,
  },
];

const state = {
  mustard: 0,
  lifetime: 0,
  clickPower: 1,
  upgrades: {},
};

function storageAvailable() {
  try {
    const testKey = "__leviathan_test__";
    window.localStorage.setItem(testKey, "ok");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn("Local storage unavailable, progress will not persist.", error);
    return false;
  }
}

const canPersist = storageAvailable();

function loadState() {
  if (!canPersist) return;
  const saved = localStorage.getItem("leviathanClickerState");
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    state.mustard = parsed.mustard ?? state.mustard;
    state.lifetime = parsed.lifetime ?? state.lifetime;
    state.clickPower = parsed.clickPower ?? state.clickPower;
    state.upgrades = parsed.upgrades ?? state.upgrades;
  } catch (error) {
    console.warn("Unable to load saved state", error);
  }
}

function saveState() {
  if (!canPersist) return;
  localStorage.setItem("leviathanClickerState", JSON.stringify(state));
}

function getUpgradeCount(id) {
  return state.upgrades[id] ?? 0;
}

function getUpgradeCost(upgrade) {
  const count = getUpgradeCount(upgrade.id);
  return Math.floor(upgrade.baseCost * Math.pow(1.15, count));
}

function calculateMps() {
  return upgrades.reduce(
    (total, upgrade) => total + upgrade.mps * getUpgradeCount(upgrade.id),
    0
  );
}

function formatNumber(value) {
  if (value < 1000) return value.toFixed(0);
  if (value < 1_000_000) return `${(value / 1000).toFixed(1)}k`;
  if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  return `${(value / 1_000_000_000).toFixed(1)}b`;
}

function updateStats() {
  mustardCount.textContent = formatNumber(state.mustard);
  mpsCount.textContent = formatNumber(calculateMps());
  lifetimeCount.textContent = formatNumber(state.lifetime);
}

function renderUpgrades() {
  upgradeList.innerHTML = "";

  upgrades.forEach((upgrade) => {
    const wrapper = document.createElement("article");
    wrapper.className = "upgrade";

    const title = document.createElement("div");
    title.className = "upgrade-title";
    title.textContent = upgrade.name;

    const countBadge = document.createElement("span");
    countBadge.textContent = `x${getUpgradeCount(upgrade.id)}`;
    title.appendChild(countBadge);

    const description = document.createElement("p");
    description.textContent = upgrade.description;

    const meta = document.createElement("p");
    const mpsLabel = upgrade.mps ? `+${upgrade.mps} MPS` : "";
    const clickLabel = upgrade.clickBoost ? `+${upgrade.clickBoost} click` : "";
    meta.textContent = [mpsLabel, clickLabel].filter(Boolean).join(" • ");

    const action = document.createElement("button");
    const cost = getUpgradeCost(upgrade);
    action.textContent = `Buy for ${formatNumber(cost)}`;
    action.disabled = state.mustard < cost;

    action.addEventListener("click", () => {
      const price = getUpgradeCost(upgrade);
      if (state.mustard < price) return;
      state.mustard -= price;
      state.upgrades[upgrade.id] = getUpgradeCount(upgrade.id) + 1;
      state.clickPower += upgrade.clickBoost;
      updateStats();
      renderUpgrades();
      saveState();
    });

    wrapper.append(title, description, meta, action);
    upgradeList.appendChild(wrapper);
  });
}

function addMustard(amount) {
  state.mustard += amount;
  state.lifetime += amount;
  updateStats();
  renderUpgrades();
}

clickerButton.addEventListener("click", () => {
  addMustard(state.clickPower);
  saveState();
});

resetButton.addEventListener("click", () => {
  if (!window.confirm("Reset your mustard empire?")) return;
  state.mustard = 0;
  state.lifetime = 0;
  state.clickPower = 1;
  state.upgrades = {};
  updateStats();
  renderUpgrades();
  saveState();
});

loadState();
updateStats();
renderUpgrades();

setInterval(() => {
  const mps = calculateMps();
  if (mps > 0) {
    addMustard(mps);
    saveState();
  }
}, 1000);
