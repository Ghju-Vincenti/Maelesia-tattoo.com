document.addEventListener('DOMContentLoaded', () => {
  const container   = document.getElementById('tattoos-container');
  const styleFilter = document.getElementById('styleFilter');
  const tagFilter   = document.getElementById('tagFilter');
  const dateFilter  = document.getElementById('dateFilter');
  const modal       = document.getElementById('modal');
  const modalImg    = document.getElementById('modal-img');
  const modalTitle  = document.getElementById('modal-title');
  const modalDesc   = document.getElementById('modal-description');
  const modalStyle  = document.getElementById('modal-style');
  const modalDate   = document.getElementById('modal-date');
  const closeModal  = document.getElementById('closeModal');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');

  if (!container || !styleFilter || !tagFilter || !dateFilter || !modal) {
    console.error('Éléments manquants');
    return;
  }

  let allTattoos    = [];
  let currentImages = [];
  let currentIndex  = 0;
  const projectId   = 'omiqn05p';
  const query       = encodeURIComponent('*[_type == "tattoo"]');
  const url         = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/production?query=${query}`;

  fetch(url)
    .then(r => r.json())
    .then(d => {
      allTattoos = d.result.map(t => ({
        ...t,
        tags: t.tags || []  // on attend un champ `tags: []` dans Sanity
      }));
      populateFilter(styleFilter, allTattoos.flatMap(t => t.style ? [t.style] : []));
      populateFilter(tagFilter,   allTattoos.flatMap(t => t.tags));
      renderTattoos();
    })
    .catch(e => console.error(e));

  function populateFilter(selectEl, items) {
    const uniques = [...new Set(items.filter(Boolean))].sort();
    uniques.forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      selectEl.appendChild(opt);
    });
  }

  function renderTattoos() {
    const s = styleFilter.value;
    const t = tagFilter.value;
    const d = dateFilter.value;
    let list = [...allTattoos];

    if (s) list = list.filter(x => x.style === s);
    if (t) list = list.filter(x => x.tags.includes(t));
    list.sort((a,b) => {
      const da = new Date(a._createdAt), db = new Date(b._createdAt);
      return d === 'oldest' ? da - db : db - da;
    });

    container.innerHTML = '';
    list.forEach(tat => {
      const imgObj = Array.isArray(tat.images) && tat.images.length
        ? tat.images[0] : tat.image;
      if (!imgObj?.asset?._ref) return;
      const [,id,dims,fmt] = imgObj.asset._ref.split('-');
      const src = `https://cdn.sanity.io/images/${projectId}/production/${id}-${dims}.${fmt}`;

      const card = document.createElement('div');
      card.className = 'tattoo-card';
      card.innerHTML = `<img src="${src}" alt="${tat.title}">`;
      card.addEventListener('click', () => openModal(tat));
      container.appendChild(card);
    });
  }

  function openModal(tat) {
    currentImages = Array.isArray(tat.images) && tat.images.length
      ? tat.images : tat.image ? [tat.image] : [];
    currentIndex = 0;
    updateModal(tat);
    modal.style.display = 'flex';
  }

  function updateModal(tat) {
    if (!currentImages.length) return;
    const imgRef = currentImages[currentIndex].asset._ref.split('-');
    const src    = `https://cdn.sanity.io/images/${projectId}/production/${imgRef[1]}-${imgRef[2]}.${imgRef[3]}`;
    modalImg.src        = src;
    modalTitle.textContent  = tat.title;
    modalDesc.textContent   = tat.description || '';
    modalStyle.textContent  = tat.style  ? `Style : ${tat.style}` : '';
    modalDate.textContent   = `Créé le : ${new Date(tat._createdAt).toLocaleDateString('fr-FR')}`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateModal(allTattoos.find(x => x._id === allTattoos.find(t => t.images?.some(i => i.asset._ref === currentImages[currentIndex].asset._ref))._id));
  });
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateModal(allTattoos.find(x => x._id === allTattoos.find(t => t.images?.some(i => i.asset._ref === currentImages[currentIndex].asset._ref))._id));
  });

  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target===modal) modal.style.display='none'; });

  styleFilter.addEventListener('change', renderTattoos);
  tagFilter.addEventListener('change',   renderTattoos);
  dateFilter.addEventListener('change',  renderTattoos);
});
