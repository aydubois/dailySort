const STORAGE_KEY = "dailySort.people";

const personForm = document.getElementById("person-form");
const personInput = document.getElementById("person-input");
const peopleList = document.getElementById("people-list");
const peopleEmpty = document.getElementById("people-empty");
const deck = document.getElementById("deck");
const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");
const result = document.getElementById("result");

let people = loadPeople();
let isDrawing = false;

function loadPeople() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePeople() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

/** Mélange un tableau (Fisher-Yates), renvoie une copie. */
function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Liste éditable des participants. */
function renderPeople() {
  peopleList.innerHTML = "";
  peopleEmpty.hidden = people.length >= 2;
  peopleEmpty.textContent =
    people.length === 0
      ? "Ajoute au moins 2 participants."
      : "Ajoute au moins un participant de plus.";

  people.forEach((person) => {
    const li = document.createElement("li");
    li.className = "person-chip";

    const name = document.createElement("span");
    name.textContent = person.name;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn-remove";
    removeBtn.setAttribute("aria-label", `Retirer ${person.name}`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => removePerson(person.id));

    li.append(name, removeBtn);
    peopleList.appendChild(li);
  });

  shuffleBtn.disabled = people.length < 2;
}

/** Deck de cartes face cachée, une par participant. */
function renderDeck() {
  deck.className = "deck";
  deck.innerHTML = "";
  result.textContent = "";
  resetBtn.hidden = true;
  shuffleBtn.hidden = false;
  shuffleBtn.textContent = "Mélanger & piocher";

  people.forEach((person) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = person.id;

    const back = document.createElement("div");
    back.className = "card-face card-back";

    const front = document.createElement("div");
    front.className = "card-face card-front";
    front.textContent = person.name;

    card.append(back, front);
    deck.appendChild(card);
  });
}

function addPerson(name) {
  people.push({ id: Date.now(), name });
  savePeople();
  renderPeople();
  renderDeck();
}

function removePerson(id) {
  people = people.filter((p) => p.id !== id);
  savePeople();
  renderPeople();
  renderDeck();
}

/** Mélange visuel puis tire une carte au hasard. */
function drawWinner() {
  if (isDrawing || people.length < 2) return;
  isDrawing = true;

  shuffleBtn.disabled = true;
  result.textContent = "Mélange en cours…";

  // Réinitialise l'état d'un tirage précédent (cartes face cachée, sans gagnant).
  deck.classList.remove("revealed");
  Array.from(deck.children).forEach((card) =>
    card.classList.remove("flipped", "winner")
  );

  // Réordonne visuellement les cartes pour l'effet de battage.
  shuffled(Array.from(deck.children)).forEach((card) => deck.appendChild(card));
  deck.classList.add("shuffling");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = reduceMotion ? 200 : 1000;

  setTimeout(() => {
    deck.classList.remove("shuffling");

    const cards = Array.from(deck.children);
    const winner = cards[Math.floor(Math.random() * cards.length)];

    winner.classList.add("flipped");
    deck.classList.add("revealed");

    setTimeout(() => {
      winner.classList.add("winner");
      const name = people.find((p) => String(p.id) === winner.dataset.id)?.name ?? "";
      result.textContent = `🎉 ${name} commence !`;
    }, reduceMotion ? 0 : 450);

    shuffleBtn.disabled = false;
    shuffleBtn.textContent = "Re-mélanger";
    resetBtn.hidden = false;
    isDrawing = false;
  }, delay);
}

personForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = personInput.value.trim();
  if (!name) return;
  addPerson(name);
  personInput.value = "";
  personInput.focus();
});

shuffleBtn.addEventListener("click", drawWinner);
resetBtn.addEventListener("click", renderDeck);

renderPeople();
renderDeck();
