import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'quote',
  title: 'Scientific Quote',
  type: 'document',
  fields: [
    defineField({ name: 'compound', type: 'string', validation: r => r.required() }),
    defineField({ name: 'quote', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'scientist', type: 'string' }),
    defineField({ name: 'organization', type: 'string' }),
    defineField({ name: 'source', type: 'url' }),
  ],
  preview: { select: { title: 'compound', subtitle: 'scientist' } }
})

