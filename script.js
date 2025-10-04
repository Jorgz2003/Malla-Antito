/* Datos de la malla */
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
    { nombre: "Farmacología", prereq: ["Fisiología"] },
    { nombre: "Fisiopatología", prereq: ["Fisiología"] },
    { nombre: "Enfermería del adulto I", prereq: ["Proceso enfermero en el ciclo vital"] },
    { nombre: "Educación para la salud II", prereq: ["Educación para la salud I"] },
    { nombre: "Teología II", prereq: ["Teología I PEG 2"] },
    { nombre: "Ética PEG 4", prereq: [] }
  ],
  "IV SEM": [
    { nombre: "Semiología y examen físico", prereq: ["Fisiopatología"] },
    { nombre: "Enfermería del adulto II", prereq: ["Enfermería del adulto I"] },
    { nombre: "Enfermería en salud mental y psiquiatría", prereq: ["Proceso enfermero en el ciclo vital"] },
    { nombre: "Salud pública", prereq: [] },
    { nombre: "Oferta variable PEG 5", prereq: [] }
  ],
  "V SEM": [
    { nombre: "Enfermería del adulto mayor", prereq: ["Enfermería del adulto II"] },
    { nombre: "Enfermería del niño y adolescente I", prereq: ["Proceso enfermero en el ciclo vital"] },
    { nombre: "Enfermería en salud sexual y reproductiva", prereq: ["Proceso enfermero en el ciclo vital"] },
    { nombre: "Epidemiología", prereq: ["Salud pública"] },
    { nombre: "Oferta variable PEG 6", prereq: [] }
  ],
  "VI SEM": [
    { nombre: "Enfermería del adulto en estado crítico", prereq: ["Enfermería del adulto II"] },
    { nombre: "Enfermería del niño y adolescente II", prereq: ["Enfermería del niño y adolescente I"] },
    { nombre: "Enfermería materno perinatal", prereq: ["Enfermería en salud sexual y reproductiva"] },
    { nombre: "Gestión del cuidado", prereq: [] },
    { nombre: "Oferta variable PEG 7", prereq: [] }
  ],
  "VII SEM": [
    { nombre: "Enfermería en urgencias y desastres", prereq: ["Enfermería del adulto en estado crítico"] },
    { nombre: "Enfermería comunitaria y familiar", prereq: ["Epidemiología"] },
    { nombre: "Investigación en enfermería I", prereq: [] },
    { nombre: "Oferta variable PEG 8", prereq: [] }
  ],
  "VIII SEM": [
    { nombre: "Enfermería en cuidados paliativos", prereq: ["Enfermería del adulto mayor"] },
    { nombre: "Bioética", prereq: ["Ética PEG 4"] },
    { nombre: "Investigación en enfermería II", prereq: ["Investigación en enfermería I"] },
    { nombre: "Práctica profesional menor", prereq: ["Enfermería comunitaria y familiar"] }
  ],
  "IX SEM": [
    { nombre: "Introducción al ejercicio profesional de enfermería", prereq: ["Práctica profesional menor"] }
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

/* Mapas */
const courseMap = new Map();
const dependentsMap = new Map();

/* Variable para selección múltiple */
let selectedCourses = new Set();

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
    el.classList.remove('locked','unlocked','completed','shake','selected');
    if (obj.completed) {
      el.classList.add('completed');
    } else if (canUnlock(nombre)) {
      el.classList.add('unlocked');
      // Mostrar si está seleccionado
      if (selectedCourses.has(nombre)) {
        el.classList.add('selected');
      }
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
  el.addEventListener('click', (e) => {
    // Si ya está completado, desmarcar
    if (obj.completed) {
      const toUnmark = new Set();
      function dfs(u) {
        toUnmark.add(u);
        (dependentsMap.get(u) || []).forEach(d => dfs(d));
      }
      dfs(nombre);
      toUnmark.forEach(n => courseMap.get(n).completed = false);
      selectedCourses.clear();
      updateLocks();
      return;
    }

    // Verificar si puede desbloquearse
    if (!canUnlock(nombre)) {
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 360);
      showMessage('No puedes marcar este ramo: faltan prerrequisitos.', 2000);
      return;
    }

    // Selección múltiple con Ctrl/Cmd + clic
    if (e.ctrlKey || e.metaKey) {
      if (selectedCourses.has(nombre)) {
        selectedCourses.delete(nombre);
      } else {
        selectedCourses.add(nombre);
      }
      updateLocks();
      
      if (selectedCourses.size > 0) {
        showMessage(`${selectedCourses.size} ramo${selectedCourses.size > 1 ? 's' : ''} seleccionado${selectedCourses.size > 1 ? 's' : ''} (Ctrl+clic para añadir más)`, 2000);
      }
      return;
    }

    // Si hay ramos seleccionados, marcarlos todos
    if (selectedCourses.size > 0) {
      selectedCourses.add(nombre); // Añadir el actual también
      let count = 0;
      selectedCourses.forEach(courseName => {
        const courseObj = courseMap.get(courseName);
        if (courseObj && !courseObj.completed && canUnlock(courseName)) {
          courseObj.completed = true;
          count++;
        }
      });
      selectedCourses.clear();
      updateLocks();
      
      if (count > 0) {
        showMessage(`¡Felicidades Antito, eres la mejor! 💖 (${count} ramo${count > 1 ? 's' : ''} completado${count > 1 ? 's' : ''})`, 3500);
      }
      return;
    }

    // Marcar solo este ramo
    obj.completed = true;
    updateLocks();
    showMessage('¡Felicidades Antito, eres la mejor! 💖', 3000);
  });
});

/* Estado inicial */
updateLocks();
