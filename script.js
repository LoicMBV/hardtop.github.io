
let annoncesFiltrees = [];
let indexAffichage = 0;
const chunkSize = 10;

let allAnnonces = [];

async function loadAnnonces() {
  const response = await fetch('links.json');
  const annonces = await response.json();
  allAnnonces = annonces;
  appliquerFiltres();
}

function afficherAnnonces(annonces) {
  const container = document.querySelector('.annonces');

  annonces.forEach((annonce) => {
    const div = document.createElement('div');
    div.className = 'annonce';
    div.innerHTML = `
      <a href="${annonce.ficheUrl}">
        <img src="${annonce.image}" alt="${annonce.title}" />
        <div class="info">
          <h2>${annonce.title}</h2>
          <p class="prix">${annonce.price}</p>
        </div>
      </a>
    `;
    container.appendChild(div);
  });
}

// Fonction utilitaire pour récupérer les cases cochées d'un groupe
function getCheckedValues(id) {
  return Array.from(document.querySelectorAll(`#${id} input[type="checkbox"]:checked`)).map(el => el.value);
}

function appliquerFiltres() {
  const marques = getCheckedValues('filtre-marque');

  const tri = document.getElementById('tri').value;

  annoncesFiltrees = allAnnonces.filter((a) => {
    const okMarque = marques.length === 0 || marques.some(m => a.title.toLowerCase().includes(m.toLowerCase()));
    
    return okMarque;
  });

  // Tri
  if (tri === 'prix-asc') {
    annoncesFiltrees.sort((a, b) => a.priceValue - b.priceValue);
  } else if (tri === 'prix-desc') {
    annoncesFiltrees.sort((a, b) => b.priceValue - a.priceValue);
  } 

  indexAffichage = 0;
  document.querySelector('.annonces').innerHTML = '';
  chargerPlus();
}

function chargerPlus() {
  const prochainChunk = annoncesFiltrees.slice(indexAffichage, indexAffichage + chunkSize);
  afficherAnnonces(prochainChunk);
  indexAffichage += chunkSize;
}

// Ajout de tous les écouteurs de filtres multiples dynamiquement
['filtre-marque']
  .forEach(id => {
    document.getElementById(id).addEventListener('change', appliquerFiltres);
  });

document.getElementById('tri').addEventListener('change', appliquerFiltres);

loadAnnonces();

window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (nearBottom && indexAffichage < annoncesFiltrees.length) {
    chargerPlus();
  }
});
