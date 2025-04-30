let tasques = [];
let categories = [];
let tasquesID = 0;

function incrementaTasquesID() {
  tasquesID++;
  localStorage.setItem("tasquesID", tasquesID);
}

function setTasquesID(newID) {
  tasquesID = newID;
  localStorage.setItem("tasquesID", tasquesID);
}

export { tasques, categories, tasquesID, incrementaTasquesID, setTasquesID};