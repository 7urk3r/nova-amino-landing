import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'catalogPage',
  title: 'Catalog Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Product Catalog',
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
      name: 'taxonomyConfig',
      title: 'Area of Study Configuration',
      type: 'object',
      fields: [
        {
          name: 'visibleCategories',
          title: 'Visible Areas of Study',
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
          description: 'Select which areas of study to show in filters',
        },
        {
          name: 'categorySynonyms',
          title: 'Area of Study Synonyms',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'category', title: 'Area of Study', type: 'string'},
                {name: 'synonyms', title: 'Synonyms', type: 'array', of: [{type: 'string'}]},
              ],
            },
          ],
          description: 'Add search synonyms for areas of study',
        },
      ],
    }),
    defineField({
      name: 'searchConfig',
      title: 'Search Configuration',
      type: 'object',
      fields: [
        {
          name: 'enableSearch',
          title: 'Enable Search',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'searchPlaceholder',
          title: 'Search Placeholder Text',
          type: 'string',
          initialValue: 'Search peptides...',
        },
        {
          name: 'enableFilters',
          title: 'Enable Filters',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'filterOptions',
          title: 'Available Filters',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Price Range', value: 'price'},
              {title: 'In Stock', value: 'stock'},
              {title: 'Area of Study', value: 'category'},
              {title: 'Molecular Weight', value: 'molecular-weight'},
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'sortingOptions',
      title: 'Sorting Options',
      type: 'object',
      fields: [
        {
          name: 'defaultSort',
          title: 'Default Sort Order',
          type: 'string',
          options: {
            list: [
              {title: 'Name (A-Z)', value: 'name-asc'},
              {title: 'Name (Z-A)', value: 'name-desc'},
              {title: 'Price (Low to High)', value: 'price-asc'},
              {title: 'Price (High to Low)', value: 'price-desc'},
              {title: 'Newest First', value: 'date-desc'},
              {title: 'Relevance', value: 'relevance'},
            ],
          },
          initialValue: 'name-asc',
        },
        {
          name: 'availableSorts',
          title: 'Available Sort Options',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Name', value: 'name'},
              {title: 'Price', value: 'price'},
              {title: 'Date Added', value: 'date'},
              {title: 'Relevance', value: 'relevance'},
              {title: 'Popularity', value: 'popularity'},
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'productCardConfig',
      title: 'Product Card Configuration',
      type: 'object',
      fields: [
        {
          name: 'showFields',
          title: 'Fields to Display',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Product Name', value: 'name'},
              {title: 'Main Image', value: 'mainImage'},
              {title: 'Price Range', value: 'price'},
              {title: 'Primary Area of Study', value: 'primaryCategory'},
              {title: 'Areas of Study', value: 'categories'},
              {title: 'In Stock Status', value: 'inStock'},
              {title: 'CAS Number', value: 'casNumber'},
              {title: 'Molecular Formula', value: 'molecularFormula'},
            ],
          },
          initialValue: ['name', 'mainImage', 'price', 'primaryCategory', 'inStock'],
        },
        {
          name: 'cardLayout',
          title: 'Card Layout',
          type: 'string',
          options: {
            list: [
              {title: 'Grid', value: 'grid'},
              {title: 'List', value: 'list'},
              {title: 'Compact', value: 'compact'},
            ],
          },
          initialValue: 'grid',
        },
      ],
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
      subtitle: 'slug.current',
    },
  },
})