document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tattoo-previews');

  if (!container) {
    console.error('Container with id "tattoo-previews" not found.');
    return;
  }

  const projectId = 'omiqn05p';
  const dataset = 'production';
  const apiVersion = '2021-06-07';

  const query = encodeURIComponent(`*[_type == "preview"]`);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.result || !data.result.length) {
        container.innerHTML = '<p>Aucun tatouage à afficher.</p>';
        return;
      }

      container.innerHTML = ''; // Clear previous content
      container.classList.add('tattoo-preview-grid'); // Optional class for grid layout

      data.result.forEach(preview => {
        if (!preview.image?.asset?._ref) return;

        const [_, id, dims, format] = preview.image.asset._ref.split('-');
        const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${format}`;

        const card = document.createElement('div');
        card.className = 'tattoo-preview-card';
        card.innerHTML = `
          <img src="${imageUrl}" alt="${preview.title || 'Tatouage'}" />
          <h4>${preview.title || 'Sans titre'}</h4>
          <p>${preview.description || ''}</p>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Erreur lors du chargement des tatouages:', error);
      container.innerHTML = '<p>Erreur lors du chargement des tatouages.</p>';
    });
});
