import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productDetailPage',
  title: 'Product Detail Page (PDP)',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product Reference',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),

    // Product Images Section (references product.images)
    defineField({
      name: 'productImages',
      title: 'Product Images Configuration',
      type: 'object',
      fields: [
        {
          name: 'useProductImages',
          title: 'Use Product Images',
          type: 'boolean',
          initialValue: true,
          description: 'Automatically use mainImage and backImage from product',
        },
        {
          name: 'moleculeViewer3D',
          title: '3D Molecule Viewer',
          type: 'object',
          fields: [
            {name: 'enabled', title: 'Enable 3D Viewer', type: 'boolean', initialValue: true},
          ],
        },
        {
          name: 'additionalImages',
          title: 'Additional PDP Images',
          type: 'array',
          of: [{type: 'image', options: {hotspot: true}}],
          description: 'Optional additional images specific to this PDP',
        },
      ],
    }),

    // Molecule File Section
    defineField({
      name: 'moleculeFile',
      title: 'Molecular Data',
      type: 'object',
      fields: [
        {
          name: 'molFile',
          title: 'MOL File',
          type: 'file',
          options: {accept: '.mol'},
        },
        {
          name: 'sdfFile',
          title: 'SDF File',
          type: 'file',
          options: {accept: '.sdf'},
        },
        {
          name: 'smilesString',
          title: 'SMILES String',
          type: 'string',
        },
      ],
    }),

    // Identification + Areas of Study
    defineField({
      name: 'identification',
      title: 'Identification & Areas of Study',
      type: 'object',
      fields: [
        {
          name: 'commonName',
          title: 'Common Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'synonyms',
          title: 'Synonyms',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'casNumber',
          title: 'CAS Number',
          type: 'string',
        },
        {
          name: 'pubchemCid',
          title: 'PubChem CID',
          type: 'string',
        },
        {
          name: 'molecularFormula',
          title: 'Molecular Formula',
          type: 'string',
        },
        {
          name: 'molecularWeight',
          title: 'Molecular Weight',
          type: 'string',
        },
        {
          name: 'useProductAreasOfStudy',
          title: 'Use Product Areas of Study',
          type: 'boolean',
          initialValue: true,
          description: 'Automatically use categories and primaryCategory from linked product',
        },
        {
          name: 'ruoStatus',
          title: 'Research Use Only Status',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),

    // Purchase Options (linked to product)
    defineField({
      name: 'purchaseOptions',
      title: 'Purchase Options',
      type: 'object',
      fields: [
        {
          name: 'useProductVariants',
          title: 'Use Product Variants & Pricing',
          type: 'boolean',
          initialValue: true,
          description: 'Automatically use variants and pricing from linked product',
        },
        {
          name: 'disclaimerText',
          title: 'Purchase Disclaimer',
          type: 'text',
          initialValue: 'For research use only. Not for human consumption. See Terms at checkout.',
        },
      ],
    }),

    // Product Summary
    defineField({
      name: 'productSummary',
      title: 'Product Summary',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
          },
        },
      ],
    }),

    // Need to Know
    defineField({
      name: 'needToKnow',
      title: 'Need-to-Know',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'category', title: 'Category', type: 'string'},
            {name: 'details', title: 'Details', type: 'text'},
          ],
          preview: {
            select: {title: 'category', subtitle: 'details'},
          },
        },
      ],
    }),

    // Regulatory Status
    defineField({
      name: 'regulatoryStatus',
      title: 'Regulatory Status',
      type: 'object',
      fields: [
        {
          name: 'fdaApproved',
          title: 'FDA Approved',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'investigationalStatus',
          title: 'Investigational Status',
          type: 'string',
          options: {
            list: [
              {title: 'Preclinical', value: 'preclinical'},
              {title: 'Phase I', value: 'phase-1'},
              {title: 'Phase II', value: 'phase-2'},
              {title: 'Phase III', value: 'phase-3'},
              {title: 'Approved', value: 'approved'},
              {title: 'Investigational', value: 'investigational'},
            ],
          },
        },
        {
          name: 'statusDescription',
          title: 'Status Description',
          type: 'text',
        },
        {
          name: 'sourceLinks',
          title: 'Source Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Link Title', type: 'string'},
                {name: 'url', title: 'URL', type: 'url'},
                {name: 'date', title: 'Date', type: 'date'},
              ],
            },
          ],
        },
      ],
    }),

    // Study Overview
    defineField({
      name: 'studyOverview',
      title: 'Study Overview',
      type: 'object',
      fields: [
        {
          name: 'autoFeed',
          title: 'Auto-feed Studies',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'studies',
          title: 'Manual Studies',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Study Title', type: 'string'},
                {name: 'year', title: 'Year', type: 'number'},
                {name: 'summary', title: 'Summary', type: 'text'},
                {name: 'type', title: 'Study Type', type: 'string'},
                {name: 'url', title: 'Study URL', type: 'url'},
              ],
              preview: {
                select: {title: 'title', subtitle: 'year'},
              },
            },
          ],
        },
      ],
    }),

    // Findings Chart
    defineField({
      name: 'findingsChart',
      title: 'Findings Chart',
      type: 'object',
      fields: [
        {
          name: 'chartTitle',
          title: 'Chart Title',
          type: 'string',
          initialValue: 'Findings (Example Chart)',
        },
        {
          name: 'chartSubtitle',
          title: 'Chart Subtitle',
          type: 'string',
          initialValue: 'Placebo vs Dosed',
        },
        {
          name: 'chartImage',
          title: 'Chart Image',
          type: 'image',
          options: {hotspot: true},
        },
        {
          name: 'chartData',
          title: 'Chart Data (JSON)',
          type: 'text',
          description: 'JSON data for dynamic chart generation',
        },
        {
          name: 'disclaimer',
          title: 'Chart Disclaimer',
          type: 'string',
          initialValue: 'Illustrative data only. Replace with study feed metrics.',
        },
      ],
    }),

    // Product History
    defineField({
      name: 'productHistory',
      title: 'Product History',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'period', title: 'Time Period', type: 'string'},
            {name: 'milestone', title: 'Milestone', type: 'string'},
            {name: 'description', title: 'Description', type: 'text'},
          ],
          preview: {
            select: {title: 'period', subtitle: 'milestone'},
          },
        },
      ],
    }),

    // Secondary Benefits (Keywords)
    defineField({
      name: 'secondaryBenefits',
      title: 'Secondary Areas of Study (Keywords)',
      type: 'object',
      fields: [
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'relatedProducts',
          title: 'Related Products',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'product'}]}],
        },
        {
          name: 'exploreText',
          title: 'Explore Text',
          type: 'string',
          initialValue: 'Click to explore related peptides',
        },
      ],
    }),

    // SEO & Meta
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
      title: 'product.name',
      subtitle: 'identification.commonName',
      media: 'productImages.vialRender',
    },
    prepare({title, subtitle}) {
      return {
        title: title || subtitle || 'Product Detail Page',
        subtitle: 'PDP Configuration',
      }
    },
  },
})