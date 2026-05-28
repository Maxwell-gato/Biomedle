
// losowanie celu
let lecturers = [];
let target = null;

fetch("lecturers.json")
  .then(res => res.json())
  .then(data => {
    lecturers = data;

    // losowanie celu dopiero po załadowaniu danych
    target = lecturers[Math.floor(Math.random() * lecturers.length)];

    initGame();
  });

function initGame() {
  const namesList = document.getElementById("names");

  lecturers.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l.name;
    namesList.appendChild(opt);
  });
}

function color(val, targetVal) {
  if (val === targetVal) return "green";

  if (typeof val === "number") {
    const diff = Math.abs(val - targetVal);
    if (diff <= 2) return "yellow";
  }

  return "red";
}

function numberHint(guess, target, label) {
  guess = Number(guess);
  target = Number(target);

  if (guess === target) {
    return {
      color: "green",
      text: `${label} ${guess}`
    };
  }

  const diff = Math.abs(guess - target);

  let color = diff <= 5 ? "yellow" : "red";
  let arrow = guess < target ? " ↑" : " ↓";

  return {
    color,
    text: `${label} ${guess}${arrow}`
  };
}

function compare(g, t) {
  return {
    department: {
      color: g.department === t.department ? "green" : "red",
      text: g.department
    },

    room: numberHint(g.room, t.room, "Pokój"),
    title: {
      color: g.title === t.title ? "green" : "red",
      text: g.title
    },

    yearOfLastTitle: (g.yearOfLastTitle == null || t.yearOfLastTitle == null)
  ? {
      color: "gray",
      text: "Rok ostatniego tytułu: brak danych"
    }
  : numberHint(g.yearOfLastTitle, t.yearOfLastTitle, "Rok ostatniego tytułu"),
    publications: numberHint(g.publications, t.publications, "Publikacje")
  };
}

function guess() {
  const name = document.getElementById("guessInput").value;
  const g = lecturers.find(l => l.name === name);

  if (!g) {
    alert("Nie ma takiego prowadzącego!");
    return;
  }

  const result = compare(g, target);

  const block = document.createElement("div");
  block.className = "guessBlock";

  block.innerHTML = `
  <table class="table">
    <tr>
      <th colspan="5">${g.name}</th>
    </tr>
    <tr>
      <td class="${result.department.color}">${result.department.text}</td>
      <td class="${result.room.color}">${result.room.text}</td>
      <td class="${result.title.color}">${result.title.text}</td>
      <td class="${result.yearOfLastTitle.color}">${result.yearOfLastTitle.text}</td>
      <td class="${result.publications.color}">${result.publications.text}</td>
    </tr>
  </table>
`;

  document.getElementById("history").prepend(block);

  if (g.name === target.name) {
    setTimeout(() => {
      alert("🎉 Gratulacje! Zgadłeś!");
    }, 100);
  }
}
