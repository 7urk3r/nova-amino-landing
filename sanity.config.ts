import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'

const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Main document types in desired order
      S.listItem()
        .title('Product Cards')
        .child(
          S.documentTypeList('product')
            .title('Product Cards')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
        ),

      S.listItem()
        .title('Access Confirmation')
        .child(S.documentTypeList('accessConfirmation')),

      S.listItem()
        .title('Landing Page')
        .child(
          S.document()
            .schemaType('landingPage')
            .documentId('e35JbV65I3hYivFZ39pHbE')
        ),

      S.listItem()
        .title('Catalog Page')
        .child(S.documentTypeList('catalogPage')),

      S.listItem()
        .title('Product Detail Pages (PDPs)')
        .child(
          S.documentTypeList('productDetailPage')
            .title('Product Detail Pages')
            .defaultOrdering([{field: 'identification.commonName', direction: 'asc'}])
        ),

      S.divider(),

      // Other page types
      S.listItem()
        .title('Customer Area Page')
        .child(S.documentTypeList('customerAreaPage')),

      S.divider(),

      S.listItem()
        .title('Navbar')
        .child(
          S.document()
            .schemaType('navbar')
            .documentId('navbar-main')
        ),

      S.divider(),

      // Site-wide components
      S.listItem()
        .title('Footer')
        .child(
          S.document()
            .schemaType('footer')
            .documentId('footer-singleton')
        ),
    ])

export default defineConfig({
  name: 'nova-amino-studio',
  title: 'Nova Amino Studio',

  projectId: 'ojsvc60h',
  dataset: 'production',
  basePath: '/studio',

  plugins: [
    deskTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
