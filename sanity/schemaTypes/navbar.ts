import {defineType} from 'sanity'

export default defineType({
  name: 'navbar',
  title: 'Navigation Bar',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Navigation Title',
      type: 'string',
      description: 'Used for internal reference'
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'object',
      fields: [
        {
          name: 'asset',
          title: 'Logo Image',
          type: 'image',
          options: {
            hotspot: true
          }
        },
        {
          name: 'url',
          title: 'Logo URL (fallback)',
          type: 'url',
          description: 'Fallback URL if no image is uploaded'
        }
      ]
    },
    {
      name: 'sticky',
      title: 'Sticky Navigation',
      type: 'boolean',
      description: 'Should the navigation stick to the top when scrolling?',
      initialValue: true
    },
    {
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Item Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Link', value: 'link'},
                  {title: 'Dropdown', value: 'dropdown'}
                ]
              },
              initialValue: 'link'
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string'
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              hidden: ({parent}) => parent?.type === 'dropdown'
            },
            {
              name: 'dropdownItems',
              title: 'Dropdown Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Label',
                      type: 'string'
                    },
                    {
                      name: 'url',
                      title: 'URL',
                      type: 'string'
                    }
                  ]
                }
              ],
              hidden: ({parent}) => parent?.type !== 'dropdown'
            }
          ]
        }
      ]
    },
    {
      name: 'actions',
      title: 'Action Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'variant',
              title: 'Button Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Link', value: 'link'},
                  {title: 'Button', value: 'button'}
                ]
              },
              initialValue: 'button'
            },
            {
              name: 'label',
              title: 'Button Text',
              type: 'string'
            },
            {
              name: 'url',
              title: 'Button URL',
              type: 'string'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
})