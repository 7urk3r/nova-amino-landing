import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'copyBlock',
  title: 'Copy Block',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      type: 'text',
      rows: 3,
      validation: r => r.required(),
      description: 'Marketing copy or supporting text'
    }),
    defineField({
      name: 'placement',
      type: 'string',
      options: { list: [
        { title: 'Hero Supporting', value: 'hero-supporting' },
        { title: 'Footer', value: 'footer' },
        { title: 'General', value: 'general' }
      ] },
      initialValue: 'general'
    }),
  ],
  preview: {
    select: {
      title: 'content',
      subtitle: 'placement'
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? title.substring(0, 60) + '...' : 'Copy Block',
        subtitle: subtitle || 'General'
      }
    }
  }
})