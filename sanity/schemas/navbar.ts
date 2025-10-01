import {defineField, defineType} from 'sanity'

const menuItem = defineType({
  name: 'navMenuItem',
  title: 'Menu Item',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: [
        {title: 'Link', value: 'link'},
        {title: 'Dropdown', value: 'dropdown'}
      ]},
      initialValue: 'link',
      validation: r => r.required()
    }),
    defineField({
      name: 'url',
      title: 'URL or Hash (/#faq, /products)',
      type: 'string',
      hidden: ({parent}) => parent?.type !== 'link'
    }),
    defineField({ name: 'newTab', title: 'Open in New Tab', type: 'boolean', initialValue: false, hidden: ({parent}) => parent?.type !== 'link' }),
    defineField({
      name: 'items',
      title: 'Dropdown Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: r => r.required() }),
          defineField({ name: 'url', title: 'URL or Hash', type: 'string', validation: r => r.required() }),
          defineField({ name: 'newTab', title: 'Open in New Tab', type: 'boolean', initialValue: false })
        ],
        preview: { select: { title: 'label', subtitle: 'url' } }
      }],
      hidden: ({parent}) => parent?.type !== 'dropdown'
    })
  ],
  preview: {
    select: { title: 'label', type: 'type', url: 'url' },
    prepare({title, type, url}) { return { title, subtitle: type === 'link' ? url : 'Dropdown' } }
  }
})

const actionButton = defineType({
  name: 'navAction',
  title: 'Action Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: r => r.required() }),
    defineField({ name: 'url', title: 'URL or Hash', type: 'string', validation: r => r.required() }),
    defineField({ name: 'variant', title: 'Variant', type: 'string', options: { list: [
      {title: 'Primary (Black)', value: 'primary'},
      {title: 'Link (Plain)', value: 'link'}
    ] }, initialValue: 'primary' }),
    defineField({ name: 'newTab', title: 'Open in New Tab', type: 'boolean', initialValue: false })
  ],
  preview: { select: { title: 'label', subtitle: 'url' } }
})

export default defineType({
  name: 'navbar',
  title: 'Navbar',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Main Navbar', validation: r => r.required() }),
    defineField({ name: 'sticky', title: 'Sticky on Scroll', type: 'boolean', initialValue: true }),
    defineField({
      name: 'logo',
      title: 'Logo (optional)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({ name: 'items', title: 'Menu Items', type: 'array', of: [menuItem], validation: r => r.min(1) }),
    defineField({ name: 'actions', title: 'Right-side Actions', type: 'array', of: [actionButton] })
  ],
  preview: { select: { title: 'title' } }
})


