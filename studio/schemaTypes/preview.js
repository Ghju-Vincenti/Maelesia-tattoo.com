export default {
  name: 'preview',
  title: 'Preview',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'tattooRef',
      title: 'Lien vers Tattoo (facultatif)',
      type: 'reference',
      to: [{ type: 'tattoo' }]
    },
    {
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number'
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image'
    }
  }
};
