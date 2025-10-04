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

const container = document.getElementById('malla-container');

// Generar HTML
Object.keys(malla).forEach(semestre => {
  const semDiv = document.createElement('div');
  semDiv.classList.add('semestre');

  const title = document.createElement('h2');
  title.textContent = semestre;
  semDiv.appendChild(title);

  malla[semestre].forEach(ramo => {
    const div = document.createElement('div');
    div.classList.add('ramo');
    div.textContent = ramo.nombre;
    div.dataset.nombre = ramo.nombre;
    semDiv.appendChild(div);
  });

  container.appendChild(semDiv);
});

// Lógica de selección
const allRamos = document.querySelectorAll('.ramo');

allRamos.forEach(ramo => {
  ramo.addEventListener('click', () => {
    // limpiar selección previa
    allRamos.forEach(r => r.classList.remove('selected', 'prereq'));

    const selectedName = ramo.dataset.nombre;
    ramo.classList.add('selected');

    // marcar prerrequisitos
    const prereqNames = findPrereq(selectedName);
    allRamos.forEach(r => {
      if (prereqNames.includes(r.dataset.nombre)) {
        r.classList.add('prereq');
      }
    });
  });
});

// Buscar todos los prerrequisitos de forma recursiva
function findPrereq(ramoName) {
  let result = [];
  for (const semestre in malla) {
    for (const ramo of malla[semestre]) {
      if (ramo.nombre === ramoName) {
        result = [...ramo.prereq];
        ramo.prereq.forEach(pr => {
          result = [...result, ...findPrereq(pr)];
        });
      }
    }
  }
  return [...new Set(result)];
}

