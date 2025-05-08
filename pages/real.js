
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const container      = document.getElementById('tattoos-container');
  const styleFilter    = document.getElementById('styleFilter');
  const dateFilter     = document.getElementById('dateFilter');
  const tagDropdown    = document.getElementById('tagDropdown');
  const dropdownBtn    = document.getElementById('tagDropdownButton');
  const dropdownMenu   = document.getElementById('tagDropdownMenu');
  const tagSearch      = document.getElementById('tagSearch');
  const tagList        = document.getElementById('tagList');
  const modal          = document.getElementById('modal');
  const modalImg       = document.getElementById('modal-img');
  const modalTitle     = document.getElementById('modal-title');
  const modalDesc      = document.getElementById('modal-description');
  const modalStyle     = document.getElementById('modal-style');
  const modalDate      = document.getElementById('modal-date');
  const closeModalBtn  = document.getElementById('closeModal');
  const prevBtn        = document.getElementById('prevBtn');
  const nextBtn        = document.getElementById('nextBtn');

  const projectId = 'omiqn05p';
  const query     = encodeURIComponent('*[_type=="tattoo"]');
  const url       = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/production?query=${query}`;


  if (!container || !styleFilter || !dateFilter || !tagDropdown
      || !dropdownBtn || !dropdownMenu || !tagSearch || !tagList
      || !modal) {
    console.error('Éléments manquants dans le HTML');
    return;
  }

  let allTattoos    = [];
  let currentImages = [];
  let currentIndex  = 0;

  // Fetch from Sanity
  fetch(url)
    .then(res => res.json())
    .then(data => {
      allTattoos = data.result.map(t => ({ ...t, tags: t.tags || [] }));
      populateStyles(allTattoos);
      populateTagDropdown(allTattoos);
      renderTattoos();
    })
    .catch(err => console.error('Erreur récupération :', err));

  // Helper: populate style <select>
  function populateStyles(list) {
    const styles = [...new Set(list.map(t => t.style).filter(Boolean))].sort();
    styles.forEach(s => styleFilter.appendChild(new Option(s, s)));
  }

  // 3) Populate tag dropdown list
  function populateTagDropdown(list) {
    const tags = [...new Set(list.flatMap(t => t.tags))].filter(Boolean).sort();
    tags.forEach(tag => {
      const id    = `tag_${tag.replace(/\s+/g,'_')}`;
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" id="${id}" value="${tag}"> <span>${tag}</span>`;
      tagList.appendChild(label);
    });

    // trigger render on checkbox change
    tagList.addEventListener('change', renderTattoos);
  }


  // Toggle dropdown open/close
  dropdownBtn.addEventListener('click', () => {
    tagDropdown.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  window.addEventListener('click', e => {
    if (!tagDropdown.contains(e.target)) {
      tagDropdown.classList.remove('open');
    }
  });



  // Filter tags list by search input
  tagSearch.addEventListener('input', () => {
    const filter = tagSearch.value.trim().toLowerCase();
    tagList.querySelectorAll('label').forEach(label => {
      const txt = label.textContent.trim().toLowerCase();
      label.style.display = txt.includes(filter) ? 'flex' : 'none';
    });
  });

  // Get selected tags
  function getSelectedTags() {
    return Array.from(
      tagList.querySelectorAll('input[type=checkbox]:checked'),
      cb => cb.value
    );
  }

  // Main render function
  function renderTattoos() {
    const selStyle = styleFilter.value;
    const selDate  = dateFilter.value;
    const selTags  = getSelectedTags();
    let list = allTattoos.filter(t => {
      if (selStyle && t.style !== selStyle) return false;
      if (selTags.length && !selTags.every(tag => t.tags.includes(tag))) return false;
      return true;
    });

    // Sort by date
    list.sort((a, b) => {
      const da = new Date(a._createdAt), db = new Date(b._createdAt);
      return selDate === 'oldest' ? da - db : db - da;
    });

    // Render grid
    container.innerHTML = '';
    list.forEach(t => {
      const imgObj = Array.isArray(t.images) && t.images.length
        ? t.images[0]
        : t.image;
      if (!imgObj?.asset?._ref) return;

      const [, id, dims, fmt] = imgObj.asset._ref.split('-');
      const src = `https://cdn.sanity.io/images/${projectId}/production/${id}-${dims}.${fmt}`;

      const card = document.createElement('div');
      card.className = 'tattoo-card';
      card.innerHTML = `<img src="${src}" alt="${t.title}" />`;
      card.addEventListener('click', () => openModal(t));
      container.appendChild(card);
    });
  }

  // Open modal & init carousel
  function openModal(tat) {
    currentImages = Array.isArray(tat.images) && tat.images.length
      ? tat.images
      : tat.image
        ? [tat.image]
        : [];
    currentIndex = 0;
    updateModal(tat);
  
    // Cacher les flèches si une seule image
    if (currentImages.length < 2) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = '';
      nextBtn.style.display = '';
    }
  
    modal.style.display = 'flex';
  }
  

  // Update modal content
  function updateModal(tat) {
    if (!currentImages.length) return;
    const [_, imgId, dims, fmt] = currentImages[currentIndex].asset._ref.split('-');
    modalImg.src       = `https://cdn.sanity.io/images/${projectId}/production/${imgId}-${dims}.${fmt}`;
    modalTitle.textContent = tat.title;
    modalDesc.textContent  = tat.description || '';
    modalStyle.textContent = tat.style ? `Style : ${tat.style}` : '';
    modalDate.textContent  = `Créé le : ${new Date(tat._createdAt).toLocaleDateString('fr-FR')}`;
  }

  // Carousel navigation
  prevBtn.addEventListener('click', () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateModal(allTattoos.find(t => t.images?.some(i => i.asset._ref === currentImages[currentIndex].asset._ref)) || {});
  });
  nextBtn.addEventListener('click', () => {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateModal(allTattoos.find(t => t.images?.some(i => i.asset._ref === currentImages[currentIndex].asset._ref)) || {});
  });

  // Close modal
  closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Re-render on filter change
  styleFilter.addEventListener('change', renderTattoos);
  dateFilter.addEventListener('change', renderTattoos);
});







