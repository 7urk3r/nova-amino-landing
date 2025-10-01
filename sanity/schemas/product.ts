import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    // Images
    defineField({ name: 'frontImage', title: 'Front Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'backImage', title: 'Back Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image' }] }),
    // Pricing
    defineField({ name: 'basePrice', title: 'Base Price', type: 'number' }),
    defineField({
      name: 'dosages',
      title: 'Dosages / Variants',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'amount', title: 'Amount', type: 'number' },
          { name: 'unit', title: 'Unit', type: 'string', options: { list: ['mg','mcg','IU'] } },
          { name: 'price', title: 'Price', type: 'number' },
          { name: 'sku', title: 'SKU', type: 'string' },
        ]
      }]
    }),
    // Classification
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Supplements', value: 'supplements' },
          { title: 'Vitamins', value: 'vitamins' },
          { title: 'Amino Acids', value: 'amino-acids' }
        ]
      }
    }),
    defineField({ name: 'areaOfStudy', title: 'Area of Study', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'string' }] }),
    // Misc
    defineField({ name: 'available', title: 'Available', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number' })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'frontImage',
      price: 'basePrice'
    }
  }
})
