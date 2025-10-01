import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'ageGatePage',
  title: 'Age Gate Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Age Verification',
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heroImage',
          title: 'Hero Image Upload',
          type: 'image',
          options: {
            hotspot: true,
          },
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
        {
          name: 'ctaButtonCopy',
          title: 'CTA Button Copy',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'termsAndDisclaimers',
      title: 'Terms & Disclaimers',
      type: 'object',
      fields: [
        {
          name: 'content',
          title: 'Content',
          type: 'text',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'minimumAge',
      title: 'Minimum Age Requirement',
      type: 'number',
      validation: (Rule) => Rule.required().min(18).max(25),
      initialValue: 18,
    }),
    defineField({
      name: 'redirectUrl',
      title: 'Redirect URL (after verification)',
      type: 'string',
      description: 'Where to redirect users after age verification',
      initialValue: '/',
    }),
    defineField({
      name: 'failureRedirectUrl',
      title: 'Failure Redirect URL',
      type: 'string',
      description: 'Where to redirect users who fail age verification',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'hero.headline',
    },
  },
})