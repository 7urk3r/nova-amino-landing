import type { StructureBuilder } from 'sanity/desk'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Landing Page - consolidated entry point
      S.listItem()
        .title('Landing Page')
        .child(
          S.documentTypeList('landingPage')
            .title('Landing Pages')
        ),

      S.divider(),

      // Other page types (keeping existing structure)
      S.listItem()
        .title('Product')
        .child(
          S.documentTypeList('product')
            .title('Products')
        ),

      S.divider(),

      // Site Settings
      S.listItem()
        .title('Site Settings')
        .child(
          S.documentTypeList('siteSettings')
            .title('Site Settings')
        ),

      // Only show document types that are NOT landing page sections
      // This explicitly excludes all landing page related documents
      ...S.documentTypeListItems().filter(
        (listItem) => {
          const id = listItem.getId()
          // Hide all landing page sections and already shown items
          const hiddenTypes = [
            'landingPage',    // Already shown above
            'hero',           // Landing page section
            'whyUs',          // Landing page section
            'marqueeSection', // Landing page section
            'copyBlock',      // Mission Statement - landing page section
            'quote',          // Part of marquee - landing page section
            'featureCard',    // Part of why us - landing page section
            'studyFeed',      // Landing page section
            'faq',            // Landing page section
            'product',        // Already shown above
            'siteSettings'    // Already shown above
          ]
          return !hiddenTypes.includes(id || '')
        }
      ),
    ])