// lib/sanity.js
import { createClient } from '../node_modules/@sanity/client';
import imageUrlBuilder from '../node_modules/@sanity/image-url';

const client = createClient({
  projectId: 'omiqn05p', // Replace with your actual projectId
  dataset: 'production',
  apiVersion: 'v2024-04-17', // Use the correct API version
  useCdn: true,
  token: 'sk7xEEAKeXiNppnyygeI8KyFJpUlM6vS7akWO9QEJRX05brIPmKBVFUlTXCLPBTgsda2l9e4jnKgzsVEON9zzFBOfapmWLj8LSdlR0JSDiZ9VFkgMx1Hc3NhSf5d2bFy9ZNk5W2WMZnIqpXXKcDt7KTL9qJ9YplYNbXe2LOrfTWeHTB4qRDH', // Enclose the token in quotes
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
export { client };


