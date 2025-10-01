import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ Section',
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
      name: 'questions',
      title: 'FAQ Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer'
            },
            prepare(selection) {
              const { title, subtitle } = selection
              return {
                title: title || 'FAQ Item',
                subtitle: subtitle ? subtitle.substring(0, 50) + '...' : 'No answer set'
              }
            }
          }
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
        title: title || 'FAQ Section',
        subtitle: subtitle || 'No subtitle set'
      }
    }
  }
})