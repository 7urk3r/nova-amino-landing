import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Site Footer',
  type: 'document',
  icon: () => '🦶',
  fields: [
    defineField({
      name: 'title',
      title: 'Footer Title',
      type: 'string',
      initialValue: 'Site Footer Configuration',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'sections',
      title: 'Footer Sections',
      type: 'object',
      fields: [
        // SHOP Section
        defineField({
          name: 'shop',
          title: 'Shop Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'SHOP'
            }),
            defineField({
              name: 'links',
              title: 'Shop Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Link Text',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: { list: [ {title:'External URL', value:'url'}, {title:'FAQ Question', value:'faq'} ] },
                      initialValue: 'url'
                    }),
                    defineField({
                      name: 'url',
                      title: 'External URL',
                      type: 'url',
                      hidden: ({parent}) => parent?.linkType !== 'url',
                    }),
                    defineField({
                      name: 'faqSlug',
                      title: 'FAQ Question Slug',
                      type: 'string',
                      description: 'Enter the slug of the FAQ question (from landingPage -> FAQ)',
                      hidden: ({parent}) => parent?.linkType !== 'faq',
                    })
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'linkType'
                    }
                  }
                }
              ]
            })
          ]
        }),

        // LEARN Section
        defineField({
          name: 'learn',
          title: 'Learn Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'LEARN'
            }),
            defineField({
              name: 'links',
              title: 'Learn Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Link Text',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: { list: [ {title:'External URL', value:'url'}, {title:'FAQ Question', value:'faq'} ] },
                      initialValue: 'url'
                    }),
                    defineField({
                      name: 'url',
                      title: 'External URL',
                      type: 'url',
                      hidden: ({parent}) => parent?.linkType !== 'url'
                    }),
                    defineField({
                      name: 'faqSlug',
                      title: 'FAQ Question Slug',
                      type: 'string',
                      hidden: ({parent}) => parent?.linkType !== 'faq'
                    }),
                    defineField({
                      name: 'hasExpandableContent',
                      title: 'Has Expandable Content',
                      type: 'boolean',
                      initialValue: false,
                      description: 'Check this if this item should show expandable content instead of linking'
                    }),
                    defineField({
                      name: 'expandableContent',
                      title: 'Expandable Content',
                      type: 'text',
                      rows: 5,
                      hidden: ({parent}) => !parent?.hasExpandableContent,
                      description: 'Content to show when expanded (leave URL empty if using this)'
                    })
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      hasExpanded: 'hasExpandableContent',
                      url: 'url',
                      linkType: 'linkType'
                    },
                    prepare({title, hasExpanded, url, linkType}) {
                      return {
                        title,
                        subtitle: hasExpanded ? '📄 Expandable content' : (linkType === 'faq' ? 'FAQ link' : url)
                      }
                    }
                  }
                }
              ]
            })
          ]
        }),

        // SUPPORT Section
        defineField({
          name: 'support',
          title: 'Support Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'SUPPORT'
            }),
            defineField({
              name: 'links',
              title: 'Support Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Link Text',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: { list: [ {title:'External URL', value:'url'}, {title:'FAQ Question', value:'faq'} ] },
                      initialValue: 'url'
                    }),
                    defineField({
                      name: 'url',
                      title: 'External URL',
                      type: 'url',
                      hidden: ({parent}) => parent?.linkType !== 'url'
                    }),
                    defineField({
                      name: 'faqSlug',
                      title: 'FAQ Question Slug',
                      type: 'string',
                      hidden: ({parent}) => parent?.linkType !== 'faq'
                    }),
                    defineField({
                      name: 'hasExpandableContent',
                      title: 'Has Expandable Content',
                      type: 'boolean',
                      initialValue: false
                    }),
                    defineField({
                      name: 'expandableContent',
                      title: 'Expandable Content',
                      type: 'text',
                      rows: 5,
                      hidden: ({parent}) => !parent?.hasExpandableContent
                    })
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      hasExpanded: 'hasExpandableContent',
                      url: 'url',
                      linkType: 'linkType'
                    },
                    prepare({title, hasExpanded, url, linkType}) {
                      return {
                        title,
                        subtitle: hasExpanded ? '📄 Expandable content' : (linkType === 'faq' ? 'FAQ link' : url)
                      }
                    }
                  }
                }
              ]
            })
          ]
        }),

        // COMPANY Section
        defineField({
          name: 'company',
          title: 'Company Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'COMPANY'
            }),
            defineField({
              name: 'links',
              title: 'Company Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Link Text',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: { list: [ {title:'External URL', value:'url'}, {title:'FAQ Question', value:'faq'} ] },
                      initialValue: 'url'
                    }),
                    defineField({
                      name: 'url',
                      title: 'External URL',
                      type: 'url',
                      hidden: ({parent}) => parent?.linkType !== 'url'
                    }),
                    defineField({
                      name: 'faqSlug',
                      title: 'FAQ Question Slug',
                      type: 'string',
                      hidden: ({parent}) => parent?.linkType !== 'faq'
                    }),
                    defineField({
                      name: 'hasExpandableContent',
                      title: 'Has Expandable Content',
                      type: 'boolean',
                      initialValue: false
                    }),
                    defineField({
                      name: 'expandableContent',
                      title: 'Expandable Content',
                      type: 'text',
                      rows: 10,
                      hidden: ({parent}) => !parent?.hasExpandableContent,
                      description: 'For long legal content like Terms of Service'
                    })
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      hasExpanded: 'hasExpandableContent',
                      url: 'url',
                      linkType: 'linkType'
                    },
                    prepare({title, hasExpanded, url, linkType}) {
                      return {
                        title,
                        subtitle: hasExpanded ? '📄 Expandable content' : (linkType === 'faq' ? 'FAQ link' : url)
                      }
                    }
                  }
                }
              ]
            })
          ]
        })
      ]
    }),

    defineField({
      name: 'enabled',
      title: 'Footer Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to enable/disable the footer sitewide'
    })
  ],

  preview: {
    select: {
      title: 'title',
      enabled: 'enabled'
    },
    prepare({title, enabled}) {
      return {
        title: title || 'Site Footer',
        subtitle: enabled ? '✅ Enabled' : '❌ Disabled'
      }
    }
  }
})