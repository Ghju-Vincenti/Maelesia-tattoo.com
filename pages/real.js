const container = document.getElementById('tattoos-container')

// Step 1: API URL
const projectId = 'omiqn05p' // Replace with your actual projectId
const dataset = 'production' // Replace with your actual dataset name
const query = encodeURIComponent('*[_type == "tattoo"]')
const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/production?query=${query}`

// Step 2: Fetch Tattoos
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const tattoos = data.result

    tattoos.forEach((tattoo) => {
      const div = document.createElement('div')
      div.classList.add('tattoo-card')

      // Build the image URL manually
      const ref = tattoo.image.asset._ref
      const [, imageId, dimensions, format] = ref.split('-')
      const imageUrl = `https://cdn.sanity.io/images/${projectId}/production/${imageId}-${dimensions}.${format}`

      // Step 3: Insert the content
      div.innerHTML = `
        <h2>${tattoo.title}</h2>
        <img src="${imageUrl}" alt="${tattoo.title}" />
        ${tattoo.description ? `<p>${tattoo.description}</p>` : ''}
        ${tattoo.style ? `<small>Style: ${tattoo.style}</small>` : ''}
        <br>
        <small>Créé le: ${new Date(tattoo._createdAt).toLocaleDateString('fr-FR')}</small>
      `
      
      container.appendChild(div)
    })
  })
  .catch((err) => console.error('Erreur lors de la récupération:', err))
