// pages/real.js
import { client, urlFor } from '../js/sanity.js'

const container = document.getElementById('tattoos-container')

const query = `*[_type == "tattoo"] | order(createdAt desc)`

client.fetch(query).then((tattoos) => {
  tattoos.forEach((tattoo) => {
    const div = document.createElement('div')
    div.classList.add('tattoo-card')
    div.innerHTML = `
      <h2>${tattoo.title}</h2>
      <img src="${urlFor(tattoo.image).width(600).url()}" alt="${tattoo.title}" />
      <p>${tattoo.description}</p>
      <small>${tattoo.style}</small>
    `
    container.appendChild(div)
  })
})

