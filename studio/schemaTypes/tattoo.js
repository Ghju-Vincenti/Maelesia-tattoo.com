// schemaTypes/tattoo.js

export default {
    name: 'tattoo',
    type: 'document',
    title: 'Tattoo',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Titre du tatouage',
      },
      {
        name: 'image',
        type: 'image',
        title: 'Image du tatouage',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'description',
        type: 'text',
        title: 'Description',
      },
      {
        name: 'style',
        type: 'string',
        title: 'Style (ex: Réalisme, Blackwork, etc.)',
      },
      {
        name: 'createdAt',
        type: 'datetime',
        title: 'Date du tatouage',
      },
    ],
  }
  