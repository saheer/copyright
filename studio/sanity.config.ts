import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {inlineSvgInput} from '@focus-reactive/sanity-plugin-inline-svg-input'

// Singletons: one document each, fixed ID, no create/delete.
const singletons = [
  'home',
  'digitalFootprintPage',
  'contact',
  'footer',
  'about',
  'servicesPage',
  'ourTechnology',
  'digestPage',
]

export default defineConfig({
  name: 'default',
  title: 'copyright',
  projectId: 'f27m5879',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Page')
              .id('home')
              .child(S.document().schemaType('home').documentId('home')),
            
            S.listItem()
              .title('About Us')
              .id('about')
              .child(S.document().schemaType('about').documentId('about')),
              
            S.listItem()
              .title('Our Technology')
              .id('ourTechnology')
              .child(S.document().schemaType('ourTechnology').documentId('ourTechnology')),

            S.listItem()
              .title('Services Page')
              .id('servicesPage')
              .child(S.document().schemaType('servicesPage').documentId('servicesPage')),
            S.documentTypeListItem('service').title('Services (the 4 solutions)'),

            S.listItem()
              .title('Digital Footprint Page')
              .id('digitalFootprintPage')
              .child(
                S.document().schemaType('digitalFootprintPage').documentId('digitalFootprintPage'),
              ),
            S.listItem()
              .title('Contact Us')
              .id('contact')
              .child(S.document().schemaType('contact').documentId('contact')),
            S.divider(),
            S.listItem()
              .title('Footer (all pages)')
              .id('footer')
              .child(S.document().schemaType('footer').documentId('footer')),
            S.divider(),
            // Blog posts (many documents, so a normal list instead of a singleton)
            S.listItem()
              .title('Digital Digest Page (SEO)')
              .id('digestPage')
              .child(S.document().schemaType('digestPage').documentId('digestPage')),
            S.documentTypeListItem('post').title('Digital Digest posts'),
          ]),
    }),
    visionTool(),
    inlineSvgInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletons.includes(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})