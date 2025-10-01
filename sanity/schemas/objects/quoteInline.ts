import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'quoteInline',
  title: 'Scientific Quote (Inline)',
  type: 'object',
  fields: [
    defineField({ name: 'compound', type: 'string', validation: r => r.required() }),
    defineField({ name: 'quote', type: 'text', rows: 3, validation: r => r.required() }),
    defineField({ name: 'scientist', type: 'string' }),
    defineField({ name: 'organization', type: 'string' }),
    defineField({ name: 'source', type: 'url' }),
  ]
})

