import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'card',
  title: 'Why Us',
  type: 'document',
  fields: [
    defineField({
      name: 'cards',
      title: '3 Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image (SVG)',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'headline',
              title: 'Headline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'subheadline',
              title: 'Subheadline',
              type: 'text',
            },
          ],
          preview: {
            select: {
              title: 'headline',
              subtitle: 'subheadline',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) => Rule.length(3),
    }),
  ],
  preview: {
    select: {
      cards: 'cards',
    },
    prepare({cards}) {
      const cardCount = cards?.length || 0
      return {
        title: 'Why Us',
        subtitle: `${cardCount}/3 cards configured`,
      }
    },
  },
})