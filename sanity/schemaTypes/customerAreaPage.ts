import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'customerAreaPage',
  title: 'Customer Area Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Customer Area',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object', fields: [{name: 'heroImage', title: 'Hero Image', type: 'image', options: {hotspot: true}}, {name: 'headline', title: 'Headline', type: 'string'}, {name: 'subheadline', title: 'Subheadline', type: 'text'}, {name: 'ctaButtonCopy', title: 'CTA Button Copy', type: 'string'}],
    }),
    defineField({
      name: 'features',
      title: 'Customer Area Features',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Feature Module',
          fields: [
            {
              name: 'id',
              title: 'Feature ID',
              type: 'string',
              options: {
                list: [
                  {title: 'Protocol Generator', value: 'protocolGenerator'},
                  {title: 'Saved Products', value: 'savedProducts'},
                  {title: 'Order History', value: 'orderHistory'},
                  {title: 'Profile Management', value: 'profileManagement'},
                  {title: 'Dosage Calculator', value: 'dosageCalculator'},
                  {title: 'Research Library', value: 'researchLibrary'},
                  {title: 'Subscription Management', value: 'subscriptionManagement'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'enabled',
              title: 'Enabled',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              validation: (Rule) => Rule.integer().min(0),
            },
            {
              name: 'accessLevel',
              title: 'Access Level Required',
              type: 'string',
              options: {
                list: [
                  {title: 'All Users', value: 'all'},
                  {title: 'Verified Users', value: 'verified'},
                  {title: 'Premium Users', value: 'premium'},
                  {title: 'Admin Only', value: 'admin'},
                ],
              },
              initialValue: 'all',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'id',
              enabled: 'enabled',
            },
            prepare({title, subtitle, enabled}) {
              return {
                title: title || subtitle,
                subtitle: `${subtitle}${enabled ? '' : ' (Disabled)'}`,
              }
            },
          },
        },
      ],
      description: 'Configure which features are available in the customer area',
    }),
    defineField({
      name: 'authenticationConfig',
      title: 'Authentication Configuration',
      type: 'object',
      fields: [
        {
          name: 'requireVerification',
          title: 'Require Email Verification',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'allowSocialLogin',
          title: 'Allow Social Login',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'socialProviders',
          title: 'Social Login Providers',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Google', value: 'google'},
              {title: 'Facebook', value: 'facebook'},
              {title: 'Apple', value: 'apple'},
            ],
          },
          hidden: ({parent}) => !parent?.allowSocialLogin,
        },
        {
          name: 'passwordRequirements',
          title: 'Password Requirements',
          type: 'object',
          fields: [
            {name: 'minLength', title: 'Minimum Length', type: 'number', initialValue: 8},
            {name: 'requireUppercase', title: 'Require Uppercase', type: 'boolean', initialValue: true},
            {name: 'requireNumbers', title: 'Require Numbers', type: 'boolean', initialValue: true},
            {name: 'requireSpecialChars', title: 'Require Special Characters', type: 'boolean', initialValue: false},
          ],
        },
      ],
    }),
    defineField({
      name: 'welcomeMessage',
      title: 'Welcome Message',
      type: 'object', fields: [{name: 'content', title: 'Content', type: 'text'}],
      description: 'Message shown to users when they first access the customer area',
    }),
    defineField({
      name: 'seoMetadata',
      title: 'SEO Metadata',
      type: 'object',
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
      featuresCount: 'features',
    },
    prepare({title, featuresCount}) {
      const count = featuresCount?.length || 0
      return {
        title: title || 'Customer Area',
        subtitle: `${count} feature${count !== 1 ? 's' : ''} configured`,
      }
    },
  },
})