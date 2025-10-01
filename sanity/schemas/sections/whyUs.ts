import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'whyUs',
  title: 'Why Us Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text'
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'featureCard' }] }]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Why Us Section',
        subtitle: subtitle
      }
    }
  }
})