// This file is part of the Tattoo Studio website project.
console.log('Sanity client:', sanityClient);
console.log('Sanity image URL builder:', imageUrlBuilder);

import { client, urlFor } from '../js/sanity.js';

const container = document.getElementById('tattoos-container');

const query = `*[_type == "Tattoo"] | order(createdAt desc)`;

console.log('Sanity client initialized:', client);

client
  .fetch(query)
  .then((tattoos) => {
    console.log('Fetched tattoos:', tattoos); // Check if tattoos are fetched correctly
    tattoos.forEach((tattoo) => {
      const div = document.createElement('div');
      div.classList.add('tattoo-card');
      div.innerHTML = `
        <h2>${tattoo.title}</h2>
        <img src="${urlFor(tattoo.image).width(600).url()}" alt="${tattoo.title}" />
        <p>${tattoo.description}</p>
        <small>${tattoo.style}</small>
      `;
      container.appendChild(div);
    });
  })
  .catch((error) => {
    console.error('Error fetching tattoos:', error); // Log any errors
  });

console.log('real.js is loaded');
