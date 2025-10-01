import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'catalog',
  title: 'Catalog',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Catalog' }),
    defineField({
      name: 'products',
      title: 'All Products (Ordered)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Drag to order. Optional if using groups.'
    }),
    defineField({
      name: 'groups',
      title: 'Groups',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string' },
          {
            name: 'items',
            title: 'Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }]
          }
        ]
      }],
      description: 'Optional groupings (e.g., Peptides, Aminos).'
    })
  ],
  preview: { select: { title: 'title' } }
})

