import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featureCard',
  title: 'Feature Card',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'body', type: 'text' }),
    defineField({ name: 'icon', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number' }),
  ],
  preview: { select: { title: 'title' } }
})

