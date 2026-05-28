const storageKey = "spideyMontessoriMvp";

const rewards = [
  { cost: 3, label: "Pick tonight's book" },
  { cost: 5, label: "Choose a favorite song" },
  { cost: 8, label: "Choose tomorrow's mission" },
  { cost: 10, label: "Extra playground time" },
  { cost: 15, label: "Special sticker or drawing" },
];

const milestones = [
  "Recognizes uppercase letters",
  "Knows most letter sounds",
  "Recognizes numbers 1-5",
  "Recognizes numbers 1-10",
  "Matches numbers to quantities",
  "Understands one more",
  "Understands one less",
  "Solves visual addition up to 5",
  "Solves visual subtraction up to 5",
  "Completes 4-card memory match",
];

const statuses = ["not started", "practicing", "mostly knows", "mastered"];
const clipArt = [
  { id: "backpack", label: "Backpack Spidey", src: "assets/clip-art/backpack-spidey.jpg" },
  { id: "bam", label: "Bam", src: "assets/clip-art/Bam.jpg" },
  { id: "boom", label: "Boom", src: "assets/clip-art/Boom.jpg" },
  { id: "doc-oc", label: "Doc Oc", src: "assets/clip-art/Doc-Oc.jpg" },
  { id: "ghost-spider", label: "Ghost spider", src: "assets/clip-art/ghost_spider.jpg" },
  { id: "green-goblin", label: "Green goblin", src: "assets/clip-art/green-goblin.jpg" },
  { id: "hanging-spidey", label: "Hanging Spidey", src: "assets/clip-art/hanging-spidey.jpg" },
  { id: "hanging-spin", label: "Hanging Spin", src: "assets/clip-art/Hanging-spin.jpg" },
  { id: "hulk", label: "Hulk", src: "assets/clip-art/Hulk.jpg" },
  { id: "iron-heart", label: "Ironheart", src: "assets/clip-art/Iron-heart.jpg" },
  { id: "iron-hulk", label: "Iron Hulk", src: "assets/clip-art/Iron-hulk.jpg" },
  { id: "ironman", label: "Iron Man", src: "assets/clip-art/Ironman.jpg" },
  { id: "marvel-spiderman", label: "Spidey", src: "assets/clip-art/Marvel-Spiderman.jpg" },
  { id: "pencil-spiderman", label: "Pencil Spidey", src: "assets/clip-art/pencil-spiderman.jpg" },
  { id: "pink-spider", label: "Pink spider", src: "assets/clip-art/Pink-spider.jpg" },
  { id: "spider-bot", label: "Spider bot", src: "assets/clip-art/Spider-bot.jpg" },
  { id: "spidey-logo", label: "Spidey logo", src: "assets/clip-art/spidey-logo.jpg" },
  { id: "spidey-mask", label: "Spidey mask", src: "assets/clip-art/spideymask.jpg" },
  { id: "spin", label: "Spin", src: "assets/clip-art/Spin.jpg" },
  { id: "web-slinger", label: "Web slinger", src: "assets/clip-art/Web-slinger-spidey.jpg" },
];
const activityFeedback = {
  letters: "Nice listening. That effort earns a star.",
  numbers: "Great counting. That effort earns a star.",
  math: "You put them together. That effort earns a star.",
};

const defaultState = {
  stars: 0,
  completedActivities: {},
  milestones: Object.fromEntries(milestones.map((milestone) => [milestone, "not started"])),
};

let state = loadState();
let flippedCards = [];
let matchedCards = 0;

const starCount = document.querySelector("#starCount");
const rewardList = document.querySelector("#rewardList");
const milestoneList = document.querySelector("#milestoneList");
const memoryGrid = document.querySelector("#memoryGrid");
const countObjects = document.querySelector("#countObjects");
const firstAddend = document.querySelector("#firstAddend");
const secondAddend = document.querySelector("#secondAddend");

function loadState() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      milestones: { ...defaultState.milestones, ...parsed.milestones },
      completedActivities: { ...defaultState.completedActivities, ...parsed.completedActivities },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function render() {
  starCount.textContent = state.stars;
  renderRewards();
  renderMilestones();
}

function addStars(amount = 1) {
  state.stars += amount;
  saveState();
  render();
}

function completeActivity(activity) {
  if (!state.completedActivities[activity]) {
    state.completedActivities[activity] = true;
    addStars(1);
  }
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.86;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function renderRewards() {
  rewardList.innerHTML = "";

  rewards.forEach((reward) => {
    const item = document.createElement("article");
    item.className = "reward-item";

    const copy = document.createElement("div");
    copy.innerHTML = `<strong>${reward.cost} stars</strong><span>${reward.label}</span>`;

    const button = document.createElement("button");
    button.className = "reward-button";
    button.type = "button";
    button.textContent = "Redeem";
    button.disabled = state.stars < reward.cost;
    button.addEventListener("click", () => {
      state.stars -= reward.cost;
      saveState();
      render();
      speak(`Redeemed ${reward.label}. Great mission work.`);
    });

    item.append(copy, button);
    rewardList.append(item);
  });
}

function renderMilestones() {
  milestoneList.innerHTML = "";

  milestones.forEach((milestone) => {
    const item = document.createElement("article");
    item.className = "milestone-item";

    const title = document.createElement("strong");
    title.textContent = milestone;

    const row = document.createElement("div");
    row.className = "status-row";

    statuses.forEach((status) => {
      const button = document.createElement("button");
      button.className = `status-button${state.milestones[milestone] === status ? " active" : ""}`;
      button.type = "button";
      button.textContent = status;
      button.addEventListener("click", () => {
        state.milestones[milestone] = status;
        saveState();
        renderMilestones();
      });
      row.append(button);
    });

    item.append(title, row);
    milestoneList.append(item);
  });
}

function resetActivityFeedback() {
  document.querySelectorAll(".choice").forEach((choice) => {
    choice.classList.remove("correct", "try-again");
  });
  document.querySelectorAll(".feedback").forEach((feedback) => {
    feedback.textContent = "";
  });
}

function createClipImage(src, alt) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  return image;
}

function renderImageSet(container, count, src, alt) {
  container.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    container.append(createClipImage(src, alt));
  }
}

function pickRandomItems(items, count) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

function renderCountingGame() {
  const [item] = pickRandomItems(clipArt, 1);
  renderImageSet(countObjects, 3, item.src, item.label);
}

function renderAdditionGame() {
  const [item] = pickRandomItems(clipArt, 1);
  renderImageSet(firstAddend, 1, item.src, item.label);
  renderImageSet(secondAddend, 2, item.src, item.label);
}

function buildMemoryGame() {
  const pairs = pickRandomItems(clipArt, 2);
  const cards = pairs.flatMap((item) => [
    { id: `${item.id}-1`, pair: item.id, image: item.src, alt: item.label },
    { id: `${item.id}-2`, pair: item.id, image: item.src, alt: item.label },
  ]).sort(() => Math.random() - 0.5);

  flippedCards = [];
  matchedCards = 0;
  memoryGrid.innerHTML = "";
  document.querySelector("#memoryFeedback").textContent = "";

  cards.forEach((card) => {
    const button = document.createElement("button");
    button.className = "memory-card";
    button.type = "button";
    button.dataset.pair = card.pair;
    button.dataset.id = card.id;
    button.dataset.image = card.image;
    button.dataset.alt = card.alt;
    button.setAttribute("aria-label", "Hidden memory card");
    button.textContent = "?";
    button.addEventListener("click", () => flipCard(button));
    memoryGrid.append(button);
  });
}

function revealMemoryCard(card) {
  card.textContent = "";
  card.append(createClipImage(card.dataset.image, card.dataset.alt));
  card.setAttribute("aria-label", card.dataset.alt);
}

function hideMemoryCard(card) {
  card.textContent = "?";
  card.setAttribute("aria-label", "Hidden memory card");
}

function flipCard(card) {
  if (card.classList.contains("matched") || card.classList.contains("flipped") || flippedCards.length === 2) {
    return;
  }

  card.classList.add("flipped");
  revealMemoryCard(card);
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const [first, second] = flippedCards;
  const feedback = document.querySelector("#memoryFeedback");

  if (first.dataset.pair === second.dataset.pair) {
    first.classList.add("matched");
    second.classList.add("matched");
    flippedCards = [];
    matchedCards += 2;
    feedback.textContent = "Match found. Careful looking!";

    if (matchedCards === 4) {
      feedback.textContent = "All matched. Memory mission complete.";
      completeActivity("memory");
      speak("All matched. Memory mission complete.");
    }
    return;
  }

  feedback.textContent = "Good try. Watch them flip back.";
  window.setTimeout(() => {
    first.classList.remove("flipped");
    second.classList.remove("flipped");
    hideMemoryCard(first);
    hideMemoryCard(second);
    flippedCards = [];
  }, 900);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".mission-card").forEach((card) => card.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.target}`).classList.add("active");
  });
});

document.querySelectorAll(".audio-button").forEach((button) => {
  button.addEventListener("click", () => speak(button.dataset.prompt));
});

document.querySelectorAll("[data-activity] .choice").forEach((choice) => {
  choice.addEventListener("click", () => {
    const activity = choice.closest("[data-activity]").dataset.activity;
    const feedback = document.querySelector(`#${activity}Feedback`);

    choice.classList.remove("try-again");

    if (choice.dataset.correct === "true") {
      choice.classList.add("correct");
      feedback.textContent = activityFeedback[activity];
      completeActivity(activity);
      speak(activityFeedback[activity]);
      return;
    }

    choice.classList.add("try-again");
    feedback.textContent = "Good try. Let's look together.";
    speak("Good try. Let's look together.");
  });
});

document.querySelector("#addEffortStar").addEventListener("click", () => {
  addStars(1);
  speak("Effort star earned.");
});

document.querySelector("#completeSession").addEventListener("click", () => {
  addStars(2);
  speak("Today's mission is complete. Great effort.");
});

document.querySelector("#resetActivities").addEventListener("click", () => {
  state.completedActivities = {};
  saveState();
  resetActivityFeedback();
  renderCountingGame();
  renderAdditionGame();
  buildMemoryGame();
  speak("Activities are ready to repeat.");
});

render();
renderCountingGame();
renderAdditionGame();
buildMemoryGame();
