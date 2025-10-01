import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true
    },
    {
      name: 'seo',
      title: 'SEO'
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // HERO SECTION (embedded)
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'heroImage',
          title: 'Hero Image Upload',
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
        {
          name: 'ctaButtonCopy',
          title: 'CTA Button Copy',
          type: 'string',
        },
      ],
    }),

    // MISSION STATEMENT SECTION (embedded)
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'content',
          title: 'Content',
          type: 'text',
        },
      ],
    }),

    // WHY US SECTION (embedded)
    defineField({
      name: 'whyUs',
      title: 'Why Us Section',
      type: 'object',
      group: 'content',
      fields: [
        {
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
        },
      ],
    }),

    // MARQUEE SECTION (embedded)
    defineField({
      name: 'marquee',
      title: 'Marquee Section',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'The Science Speaks',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
        },
        {
          name: 'quotes',
          title: 'Quotes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'compound',
                  title: 'Compound',
                  type: 'string',
                },
                {
                  name: 'quote',
                  title: 'Quote',
                  type: 'text',
                },
                {
                  name: 'scientist',
                  title: 'Scientist',
                  type: 'string',
                },
                {
                  name: 'organization',
                  title: 'Organization',
                  type: 'string',
                },
                {
                  name: 'source',
                  title: 'Source',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    }),

    // STUDY FEED SECTION (embedded)
    defineField({
      name: 'studyFeed',
      title: 'Study Feed Section',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Study Feed',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'numberOfStudies',
          title: 'Number of Studies to Show',
          type: 'number',
          validation: (Rule) => Rule.min(1).max(20),
          initialValue: 6,
        },
        {
          name: 'manualOverride',
          title: 'Manual Study Override',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Study Title', type: 'string'},
                {name: 'summary', title: 'Summary', type: 'text'},
                {name: 'url', title: 'Study URL', type: 'url'},
                {name: 'publishDate', title: 'Publish Date', type: 'date'},
              ],
            },
          ],
          description: 'Manually curated studies to override automatic feed',
        },
      ],
    }),

    // FAQ SECTION (embedded)
    defineField({
      name: 'faq',
      title: 'FAQ Section',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'enabled',
          title: 'Show FAQ Section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'FAQ Section Title',
          type: 'string',
          initialValue: 'Frequently Asked Questions',
        },
        {
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
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'answer',
                  title: 'Answer',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'question',
                  subtitle: 'answer',
                },
              },
            },
          ],
        },
      ],
    }),

    // SEO SECTION
    defineField({
      name: 'seoMetadata',
      title: 'SEO Metadata',
      type: 'object',
      group: 'seo',
      fields: [
        {name: 'metaTitle', title: 'Meta Title', type: 'string'},
        {name: 'metaDescription', title: 'Meta Description', type: 'text'},
        {name: 'ogImage', title: 'Social Share Image', type: 'image'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'hero.headline',
      media: 'hero.heroImage',
    },
  },
})