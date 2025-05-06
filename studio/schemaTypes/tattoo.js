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
      name: 'images',
      type: 'array',
      title: 'Images du tatouage',
      of: [
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
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
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [
        { type: 'string' }
      ],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Date du tatouage',
    }
  ]
};
