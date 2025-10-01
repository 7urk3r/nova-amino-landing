import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discount',
      title: 'Discount Settings',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Discount',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'type',
          title: 'Discount Type',
          type: 'string',
          options: {
            list: [
              {title: 'Percentage Off', value: 'percentage'},
              {title: 'Fixed Amount Off', value: 'fixed'},
            ],
          },
          hidden: ({parent}) => !parent?.enabled,
        },
        {
          name: 'value',
          title: 'Discount Value',
          type: 'number',
          validation: (Rule) => Rule.min(0),
          description: 'Enter percentage (e.g., 20 for 20% off) or fixed amount (e.g., 5 for $5 off)',
          hidden: ({parent}) => !parent?.enabled,
        },
        {
          name: 'label',
          title: 'Discount Label',
          type: 'string',
          placeholder: 'e.g., "20% OFF" or "SALE"',
          hidden: ({parent}) => !parent?.enabled,
        },
        {
          name: 'validUntil',
          title: 'Valid Until',
          type: 'datetime',
          description: 'Optional end date for the discount',
          hidden: ({parent}) => !parent?.enabled,
        },
      ],
      preview: {
        select: {
          enabled: 'enabled',
          type: 'type',
          value: 'value',
          label: 'label',
        },
        prepare({enabled, type, value, label}) {
          if (!enabled) return {title: 'No discount'}
          const discountText = type === 'percentage' ? `${value}%` : `$${value}`
          return {
            title: label || `${discountText} off`,
            subtitle: enabled ? 'Active' : 'Inactive',
          }
        },
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'backImage',
      title: 'Back Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Areas of Study',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Weight Loss', value: 'weight-loss'},
          {title: 'Healing', value: 'healing'},
          {title: 'Muscle', value: 'muscle'},
          {title: 'Anti-Aging', value: 'anti-aging'},
          {title: 'Cognitive', value: 'cognitive'},
          {title: 'Energy', value: 'energy'},
          {title: 'Sleep', value: 'sleep'},
          {title: 'Stress', value: 'stress'},
          {title: 'Sexual', value: 'sexual'},
          {title: 'Cosmetic', value: 'cosmetic'},
          {title: 'Immune', value: 'immune'},
          {title: 'Gut Health', value: 'gut-health'},
          {title: 'Neuroprotection', value: 'neuroprotection'},
          {title: 'Diabetes', value: 'diabetes'},
        ],
      },
    }),
    defineField({
      name: 'primaryCategory',
      title: 'Primary Area of Study',
      type: 'string',
      options: {
        list: [
          {title: 'Weight Loss', value: 'weight-loss'},
          {title: 'Healing', value: 'healing'},
          {title: 'Muscle', value: 'muscle'},
          {title: 'Anti-Aging', value: 'anti-aging'},
          {title: 'Cognitive', value: 'cognitive'},
          {title: 'Energy', value: 'energy'},
          {title: 'Sleep', value: 'sleep'},
          {title: 'Stress', value: 'stress'},
          {title: 'Sexual', value: 'sexual'},
          {title: 'Cosmetic', value: 'cosmetic'},
          {title: 'Immune', value: 'immune'},
          {title: 'Gut Health', value: 'gut-health'},
          {title: 'Neuroprotection', value: 'neuroprotection'},
          {title: 'Diabetes', value: 'diabetes'},
        ],
      },
    }),
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'key',
              title: 'Variant Key',
              type: 'string',
            },
            {
              name: 'dosage',
              title: 'Dosage',
              type: 'string',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
          ],
          preview: {
            select: {
              dosage: 'dosage',
              price: 'price',
            },
            prepare({dosage, price}) {
              return {
                title: dosage || 'No dosage',
                subtitle: price ? `$${price}` : 'No price',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product Settings',
      type: 'object',
      fields: [
        {
          name: 'isFeatured',
          title: 'Feature this Product',
          type: 'boolean',
          initialValue: false,
          description: 'Enable to show this product in featured sections',
        },
        {
          name: 'featuredOrder',
          title: 'Featured Display Order',
          type: 'number',
          validation: (Rule) => Rule.min(1).max(100),
          description: 'Lower numbers appear first (1 = first, 2 = second, etc.)',
          hidden: ({parent}) => !parent?.isFeatured,
        },
        {
          name: 'featuredBadge',
          title: 'Featured Badge Text',
          type: 'string',
          placeholder: 'e.g., "Most Popular", "Best Seller", "New"',
          description: 'Optional badge text to display on featured products',
          hidden: ({parent}) => !parent?.isFeatured,
        },
      ],
      preview: {
        select: {
          isFeatured: 'isFeatured',
          order: 'featuredOrder',
          badge: 'featuredBadge',
        },
        prepare({isFeatured, order, badge}) {
          if (!isFeatured) return {title: 'Not featured'}
          const orderText = order ? `#${order}` : 'No order set'
          const badgeText = badge ? ` • ${badge}` : ''
          return {
            title: `Featured ${orderText}${badgeText}`,
            subtitle: 'Featured product',
          }
        },
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      subtitle: 'primaryCategory',
    },
  },
})