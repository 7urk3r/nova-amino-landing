import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'heroInline',
  title: 'Hero (Inline)',
  type: 'object',
  fields: [
    defineField({ name: 'headline', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subheadline', type: 'text' }),
    defineField({ name: 'ctaText', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
  ]
})

