/* Datos de la malla (nombres exactos y prerrequisitos) */
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
  "III SEM": [
    { nombre: "Fisiopatología", prereq: ["Fisiología"] },
    { nombre: "Farmacología", prereq: ["Microbiología y parasitología", "Fisiología"] },
    { nombre: "Cuidados de enfermería I", prereq: ["Proceso enfermero en el ciclo vital"] },
    { nombre: "Educación para la salud II", prereq: ["Educación para la salud I"] },
    { nombre: "Relación de ayuda", prereq: [] },
    { nombre: "Bioestadística", prereq: [] },
    { nombre: "Minor 1", prereq: [] }
  ],
  "IV SEM": [
    { nombre: "Cuidados de enfermería II", prereq: ["Cuidados de enfermería I"] },
    { nombre: "Introducción a la enfermería comunitaria", prereq: ["Educación para la salud II"] },
    { nombre: "Inglés técnico para salud", prereq: [] },
    { nombre: "Epidemiología y salud pública", prereq: ["Bioestadística"] },
    { nombre: "Minor 2", prereq: [] },
    { nombre: "Teología II PEG 4", prereq: [] }
  ],
  "V SEM": [
    { nombre: "Enfermería clínica del adulto y persona mayor", prereq: ["Cuidados de enfermería II", "Farmacología", "Fisiopatología"] },
    { nombre: "Enfermería en la comunidad I", prereq: ["Introducción a la enfermería comunitaria"] },
    { nombre: "Enfermería y emprendimiento", prereq: [] },
    { nombre: "Metodología de la investigación", prereq: ["Bioestadística"] },
    { nombre: "Minor 3", prereq: [] }
  ],
  "VI SEM": [
    { nombre: "Enfermería de la mujer", prereq: ["Enfermería clínica del adulto y persona mayor"] },
    { nombre: "Enfermería del niño y adolescente", prereq: ["Enfermería clínica del adulto y persona mayor"] },
    { nombre: "Enfermería en la comunidad II", prereq: ["Enfermería en la comunidad I"] },
    { nombre: "Práctica basada en la evidencia", prereq: ["Metodología de la investigación"] },
    { nombre: "Ética PEG 5", prereq: [] }
  ],
  "VII SEM": [
    { nombre: "Enfermería gerontogeriátrica", prereq: ["Enfermería clínica del adulto y persona mayor"] },
    { nombre: "Cuidados de fin de la vida", prereq: ["Enfermería clínica del adulto y persona mayor"] },
    { nombre: "Ética profesional aplicada", prereq: ["Ética PEG 5"] },
    { nombre: "Gestión y administración en salud", prereq: ["Práctica basada en la evidencia"] },
    { nombre: "Oferta variable PEG 6", prereq: [] }
  ],
  "VIII SEM": [
    { nombre: "Enfermería en situaciones de urgencia", prereq: ["Enfermería clínica del adulto y persona mayor"] },
    { nombre: "Enfermería en salud mental y psiquiatría", prereq: ["Práctica basada en la evidencia"] },
    { nombre: "Liderazgo y gestión de equipos de salud", prereq: ["Gestión y administración en salud"] },
    { nombre: "Innovación", prereq: ["Práctica basada en la evidencia"] },
    { nombre: "Seminario de investigación", prereq: ["Metodología de la investigación"] },
    { nombre: "Teología III PEG 7", prereq: [] },
    { nombre: "Oferta variable PEG 8", prereq: [] }
  ],
  "IX SEM": [
    { nombre: "Introducción al ejercicio profesional de enfermería", prereq: ["Licenciatura en enfermería"] }
  ],
  "X SEM": [
    { nombre: "Internado profesional en el ámbito hospitalario adulto/niño", prereq: ["Introducción al ejercicio profesional de enfermería"] },
    { nombre: "Internado profesional en el ámbito comunitario", prereq: ["Introducción al ejercicio profesional de enfermería"] },
    { nombre: "Internado profesional en el ámbito hospitalario crítico", prereq: ["Introducción al ejercicio profesional de enfermería"] }
  ]
};

/* DOM refs */
const container = document.getElementById('malla-container');
const mensaje = document.getElementById('mensaje');
const resetBtn = document.getElementById('resetBtn');

/* Mapas para acceso rápido */
const courseMap = new Map();      // nombre -> { element, prereq, completed }
const dependentsMap = new Map();  // nombre -> [nombres que dependen de este nombre]

/* Generar UI y estructuras */
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
    // tooltip con prerrequisitos (útil)
    div.title = curso.prereq.length ? 'Prerrequisitos: ' + curso.prereq.join(', ') : 'Sin prerrequisitos';
    semDiv.appendChild(div);

    courseMap.set(curso.nombre, {
      element: div,
      prereq: curso.prereq.slice(), // copia
      completed: false
    });
  });

  container.appendChild(semDiv);
});

/* Construir mapa de dependientes */
courseMap.forEach((obj, nombre) => {
  obj.prereq.forEach(pr => {
    if (!dependentsMap.has(pr)) dependentsMap.set(pr, []);
    dependentsMap.get(pr).push(nombre);
  });
});

/* Chequea si todos los prerequisitos de 'nombre' están marcados (completed=true).
   Nota: si un prerequisito NO existe en la malla (ej: "Licenciatura en enfermería"),
   lo consideramos externo y por defecto NO cumplido (queda bloqueado). */
function canUnlock(nombre) {
  const obj = courseMap.get(nombre);
  if (!obj) return false;
  for (const pr of obj.prereq) {
    const preObj = courseMap.get(pr);
    if (!preObj) {
      // prerequisito externo no presente: no se considera cumplido
      return false;
    }
    if (!preObj.completed) return false;
  }
  return true;
}

/* Actualiza clases (locked / unlocked / completed) en UI */
function updateLocks() {
  courseMap.forEach((obj, nombre) => {
    const el = obj.element;
    el.classList.remove('locked','unlocked','completed','shake');
    if (obj.completed) {
      el.classList.add('completed');
      el.setAttribute('aria-checked','true');
      el.setAttribute('aria-disabled','false');
    } else {
      if (canUnlock(nombre)) {
        el.classList.add('unlocked');
        el.setAttribute('aria-disabled','false');
      } else {
        el.classList.add('locked');
        el.setAttribute('aria-disabled','true');
      }
      el.setAttribute('aria-checked','false');
    }
  });
}

/* Mostrar mensaje suave */
let msgTimeout = null;
function showMessage(text, duration = 3000) {
  clearTimeout(msgTimeout);
  mensaje.textContent = text;
  mensaje.classList.add('show');
  msgTimeout = setTimeout(() => {
    mensaje.classList.remove('show');
  }, duration);
}

/* Al hacer click: marcar/desmarcar con lógica de prerequisitos */
courseMap.forEach((obj, nombre) => {
  const el = obj.element;

  el.addEventListener('click', () => {
    // Si ya está completado -> desmarcarlo y desmarcar todos sus dependientes (transitivo)
    if (obj.completed) {
      const toUnmark = new Set();
      function dfs(u) {
        toUnmark.add(u);
        const deps = dependentsMap.get(u) || [];
        deps.forEach(v => {
          if (!toUnmark.has(v)) dfs(v);
        });
      }
      dfs(nombre);
      toUnmark.forEach(n => {
        const o = courseMap.get(n);
        if (o) o.completed = false;
      });
      updateLocks();
      showMessage('Se desmarcó el ramo y sus dependientes si correspondía.', 2200);
      return;
    }

    // Si no está completado: solo podemos marcar si está desbloqueado (canUnlock)
    if (!canUnlock(nombre)) {
      // feedback corto
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 360);
      showMessage('No puedes marcar este ramo: faltan prerrequisitos.', 2000);
      return;
    }

    // Marcar como completado
    obj.completed = true;
    updateLocks();
    // Mensaje tal como pediste:
    showMessage('¡Felicidades Antito, eres la mejor 💖!', 3000);
  });
});

/* Reset: desmarca todo */
resetBtn.addEventListener('click', () => {
  courseMap.forEach(o => o.completed = false);
  updateLocks();
  showMessage('Malla reseteada.', 1500);
});

/* Estado inicial */
updateLocks();
