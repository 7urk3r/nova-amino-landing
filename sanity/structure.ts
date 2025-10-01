import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Main document types
      S.listItem()
        .title('Product')
        .child(
          S.documentTypeList('product')
            .title('Products')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
        ),

      S.listItem()
        .title('Age Gate Page')
        .child(S.documentTypeList('ageGatePage')),

      // Landing Page with nested components
      S.listItem()
        .title('Landing Page')
        .child(
          S.list()
            .title('Landing Page')
            .items([
              S.listItem()
                .title('Hero')
                .child(S.documentTypeList('hero')),

              S.listItem()
                .title('Mission Statement')
                .child(S.documentTypeList('copyBlock')),

              S.listItem()
                .title('Why Us')
                .child(S.documentTypeList('card')),

              S.listItem()
                .title('Marquee')
                .child(S.documentTypeList('marquee')),

              S.listItem()
                .title('StudyFeed')
                .child(S.documentTypeList('studyFeed')),

              S.listItem()
                .title('FAQ')
                .child(S.documentTypeList('faq')),
            ])
        ),

      // Catalog Page with nested PDPs
      S.listItem()
        .title('Catalog Page')
        .child(
          S.list()
            .title('Catalog Page')
            .items([
              S.listItem()
                .title('Catalog Configuration')
                .child(S.documentTypeList('catalogPage')),

              S.divider(),

              S.listItem()
                .title('Product Detail Pages (PDPs)')
                .child(
                  S.documentTypeList('productDetailPage')
                    .title('Product Detail Pages')
                    .defaultOrdering([{field: 'identification.commonName', direction: 'asc'}])
                ),
            ])
        ),

      S.listItem()
        .title('Customer Area Page')
        .child(S.documentTypeList('customerAreaPage')),
    ])