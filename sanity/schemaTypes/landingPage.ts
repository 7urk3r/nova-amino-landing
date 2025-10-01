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

    // FEATURED PRODUCTS SECTION (embedded)
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products Section',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'enabled',
          title: 'Show Featured Products',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string',
          initialValue: 'Featured Research Compounds',
        },
        {
          name: 'subheadline',
          title: 'Section Subheadline',
          type: 'text',
          initialValue: 'Discover our most popular research-grade peptides and compounds',
        },
        {
          name: 'displayMode',
          title: 'Featured Products Display',
          type: 'string',
          options: {
            list: [
              {title: 'Automatic (use featured products)', value: 'automatic'},
              {title: 'Manual Selection', value: 'manual'},
            ],
          },
          initialValue: 'automatic',
          description: 'Choose how to select featured products',
        },
        {
          name: 'maxProducts',
          title: 'Maximum Products to Show',
          type: 'number',
          validation: (Rule) => Rule.min(1).max(12),
          initialValue: 8,
          description: 'Maximum number of featured products to display',
        },
        {
          name: 'products',
          title: 'Manual Product Selection',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{type: 'product'}],
            }
          ],
          validation: (Rule) => Rule.max(12),
          description: 'Only used when Manual Selection is chosen above',
          hidden: ({parent}) => parent?.displayMode !== 'manual',
        },
        {
          name: 'ctaButtonText',
          title: 'CTA Button Text',
          type: 'string',
          initialValue: 'View All Products',
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
                  name: 'source',
                  title: 'Source',
                  type: 'string',
                },
                {
                  name: 'sourceLink',
                  title: 'Source Link',
                  type: 'url',
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
          name: 'sections',
          title: 'FAQ Sections',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'faqSection',
              title: 'FAQ Section',
              fields: [
                {
                  name: 'sectionTitle',
                  title: 'Section Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'questions',
                  title: 'Questions in this Section',
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
                        {
                          name: 'slug',
                          title: 'Anchor Slug',
                          type: 'slug',
                          options: {
                            source: 'question',
                            maxLength: 96,
                          },
                          description: 'Used for deep-linking from footer (e.g. #faq-your-slug) ',
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
              preview: {
                select: {
                  title: 'sectionTitle',
                  subtitle: 'questions',
                },
                prepare(selection) {
                  const {title, subtitle} = selection
                  const questionCount = subtitle ? subtitle.length : 0
                  return {
                    title: title,
                    subtitle: `${questionCount} question${questionCount !== 1 ? 's' : ''}`,
                  }
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