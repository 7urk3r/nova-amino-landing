import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Site Title' }),
    defineField({ name: 'description', type: 'text', title: 'Description' }),
    defineField({
      name: 'nav',
      title: 'Primary Nav',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' }
      ] }]
    }),
  ],
})

