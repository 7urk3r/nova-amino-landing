import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image Upload',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
    }),
    defineField({
      name: 'ctaButtonCopy',
      title: 'CTA Button Copy',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'subheadline',
      media: 'heroImage',
    },
  },
})