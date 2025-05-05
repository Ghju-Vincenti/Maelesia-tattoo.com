document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tattoos-container')
  const styleFilter = document.getElementById('styleFilter')
  const dateFilter = document.getElementById('dateFilter')

  const modal = document.getElementById('modal')
  const modalImg = document.getElementById('modal-img')
  const modalTitle = document.getElementById('modal-title')
  const modalDescription = document.getElementById('modal-description')
  const modalStyle = document.getElementById('modal-style')
  const modalDate = document.getElementById('modal-date')
  const closeModal = document.getElementById('closeModal')

  if (!container || !styleFilter || !dateFilter || !modal) {
    console.error('Un ou plusieurs éléments manquent dans le HTML')
    return
  }

  let allTattoos = []

  const projectId = 'omiqn05p'
  const query = encodeURIComponent('*[_type == "tattoo"]')
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/production?query=${query}`

  fetch(url)
    .then(res => res.json())
    .then(data => {
      allTattoos = data.result
      populateStyleFilter(allTattoos)
      renderTattoos()
    })
    .catch(err => console.error('Erreur lors de la récupération:', err))

  function renderTattoos() {
    const selectedStyle = styleFilter.value
    const selectedDate = dateFilter.value

    let tattoos = [...allTattoos]

    if (selectedStyle) {
      tattoos = tattoos.filter(t => t.style === selectedStyle)
    }

    tattoos.sort((a, b) => {
      const dateA = new Date(a._createdAt)
      const dateB = new Date(b._createdAt)
      return selectedDate === 'oldest' ? dateA - dateB : dateB - dateA
    })

    container.innerHTML = ''

    tattoos.forEach(tattoo => {
      const ref = tattoo.image?.asset?._ref
      if (!ref) return

      const [, imageId, dimensions, format] = ref.split('-')
      const imageUrl = `https://cdn.sanity.io/images/${projectId}/production/${imageId}-${dimensions}.${format}`

      const img = document.createElement('img')
      img.src = imageUrl
      img.alt = tattoo.title
      img.classList.add('tattoo-img')

      img.addEventListener('click', () => {
        modalImg.src = imageUrl
        modalTitle.textContent = tattoo.title
        modalDescription.textContent = tattoo.description || 'Aucune description'
        modalStyle.textContent = tattoo.style ? `Style : ${tattoo.style}` : ''
        modalDate.textContent = `Créé le : ${new Date(tattoo._createdAt).toLocaleDateString('fr-FR')}`
        modal.style.display = 'flex'
      })

      container.appendChild(img)
    })
  }

  function populateStyleFilter(tattoos) {
    const styles = [...new Set(tattoos.map(t => t.style).filter(Boolean))]
    styles.forEach(style => {
      const option = document.createElement('option')
      option.value = style
      option.textContent = style
      styleFilter.appendChild(option)
    })
  }

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none'
    }
  })

  styleFilter.addEventListener('change', renderTattoos)
  dateFilter.addEventListener('change', renderTattoos)
})
