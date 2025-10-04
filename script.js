/* Datos de la malla (los mismos que ya cargamos antes) */
const malla = {
  "I SEM": [
    { nombre: "Ciencias básicas para la salud", prereq: [] },
    { nombre: "Anatomía e histología", prereq: [] },
    { nombre: "Fundamentos de enfermería", prereq: [] },
    { nombre: "Primeros auxilios", prereq: [] },
    { nombre: "Sociedad y cultura", prereq: [] },
    { nombre: "Desarrollo personal y autoliderazgo", prereq: [] },
    { nombre: "Antropología I PEG 1", prereq: [] }
  ],
  "II SEM": [
    { nombre: "Microbiología y parasitología", prereq: ["Ciencias básicas para la salud"] },
    { nombre: "Fisiología", prereq: ["Ciencias básicas para la salud"] },
    { nombre: "Proceso enfermero en el ciclo vital", prereq: ["Fundamentos de enfermería"] },
    { nombre: "Educación para la salud I", prereq: [] },
    { nombre: "Antropología II", prereq: ["Antropología I PEG 1"] },
    { nombre: "Teología I PEG 2", prereq: [] },
    { nombre: "Oferta variable PEG 3", prereq: [] }
  ],
  /* … resto de la malla igual que antes … */
  "X SEM": [
    { nombre: "Internado profesional en el ámbito hospitalario adulto/niño", prereq: ["Introducción al ejercicio profesional de enfermería"] },
    { nombre: "Internado profesional en el ámbito comunitario", prereq: ["Introducción al ejercicio profesional de enfermería"] },
    { nombre: "Internado profesional en el ámbito hospitalario crítico", prereq: ["Introducción al ejercicio profesional de enfermería"] }
  ]
};

/* DOM refs */
const container = document.getElementById('malla-container');
const mensaje = document.getElementById('mensaje');

/* Mapas */
const courseMap = new Map();
const dependentsMap = new Map();

/* Crear UI */
Object.keys(malla).forEach(semestre => {
  const semDiv = document.createElement('div');
  semDiv.className = 'semestre';

  const title = document.createElement('h2');
  title.textContent = semestre;
  semDiv.appendChild(title);

  malla[semestre].forEach(curso => {
    const div = document.createElement('div');
    div.className = 'ramo';
    div.textContent = curso.nombre;
    div.dataset.nombre = curso.nombre;
    div.title = curso.prereq.length ? 'Prerrequisitos: ' + curso.prereq.join(', ') : 'Sin prerrequisitos';
    semDiv.appendChild(div);

    courseMap.set(curso.nombre, {
      element: div,
      prereq: curso.prereq.slice(),
      completed: false
    });
  });

  container.appendChild(semDiv);
});

/* Dependientes */
courseMap.forEach((obj, nombre) => {
  obj.prereq.forEach(pr => {
    if (!dependentsMap.has(pr)) dependentsMap.set(pr, []);
    dependentsMap.get(pr).push(nombre);
  });
});

/* Validación */
function canUnlock(nombre) {
  const obj = courseMap.get(nombre);
  if (!obj) return false;
  for (const pr of obj.prereq) {
    const preObj = courseMap.get(pr);
    if (!preObj || !preObj.completed) return false;
  }
  return true;
}

/* Actualizar clases */
function updateLocks() {
  courseMap.forEach((obj, nombre) => {
    const el = obj.element;
    el.classList.remove('locked','unlocked','completed','shake');
    if (obj.completed) {
      el.classList.add('completed');
    } else if (canUnlock(nombre)) {
      el.classList.add('unlocked');
    } else {
      el.classList.add('locked');
    }
  });
}

/* Mensaje suave */
let msgTimeout = null;
function showMessage(text, duration = 3000) {
  clearTimeout(msgTimeout);
  mensaje.textContent = text;
  mensaje.classList.add('show');
  msgTimeout = setTimeout(() => mensaje.classList.remove('show'), duration);
}

/* Click en cada ramo */
courseMap.forEach((obj, nombre) => {
  const el = obj.element;
  el.addEventListener('click', () => {
    if (obj.completed) {
      // desmarcar este y los dependientes
      const toUnmark = new Set();
      function dfs(u) {
        toUnmark.add(u);
        (dependentsMap.get(u) || []).forEach(d => dfs(d));
      }
      dfs(nombre);
      toUnmark.forEach(n => courseMap.get(n).completed = false);
      updateLocks();
      return;
    }

    if (!canUnlock(nombre)) {
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 360);
      showMessage('No puedes marcar este ramo: faltan prerrequisitos.', 2000);
      return;
    }

    obj.completed = true;
    updateLocks();
    showMessage('¡Felicidades Antito, eres la mejor 💖!', 3000);
  });
});

/* Estado inicial */
updateLocks();
