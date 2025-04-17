// js/sanity.js
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
  projectId: 'your_project_id', // replace with yours
  dataset: 'production',
  apiVersion: '2024-04-17',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
