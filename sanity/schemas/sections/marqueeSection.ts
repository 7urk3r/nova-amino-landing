import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'marqueeSection',
  title: 'Marquee Section',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'The Science Speaks' }),
    defineField({ name: 'subtitle', type: 'text' }),
    defineField({
      name: 'quotes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'quote' }] }]
    })
  ]
})

