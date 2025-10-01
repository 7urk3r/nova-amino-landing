import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'studyFeed',
  title: 'Study Feed',
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
      name: 'studies',
      title: 'Studies',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Study Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'summary',
              title: 'Study Summary',
              type: 'text'
            },
            {
              name: 'link',
              title: 'Study Link',
              type: 'url'
            },
            {
              name: 'date',
              title: 'Publication Date',
              type: 'date'
            }
          ]
        }
      ]
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
        title: title || 'Study Feed',
        subtitle: subtitle || 'No subtitle set'
      }
    }
  }
})