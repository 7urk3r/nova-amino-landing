import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featureCardInline',
  title: 'Feature Card (Inline)',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'body', type: 'text' }),
    defineField({ name: 'icon', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number' })
  ]
})

