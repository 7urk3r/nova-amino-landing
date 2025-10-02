import {defineField, defineType} from 'sanity'

const defaultEnglishParagraphs = [
  'By entering this site, I confirm that I am at least 21 years of age and a qualified researcher. I understand that all Nova Amino products are sold strictly for laboratory research use only (RUO) and are not intended for human or veterinary consumption, medical treatment, or diagnostic purposes.',
  'I acknowledge that all information provided is for educational and informational purposes only and should not be interpreted as medical advice. I accept full responsibility for complying with all applicable laws in my jurisdiction and agree to hold Nova Amino harmless from any misuse of products.',
  'I also consent to the use of cookies required for essential site functions (such as remembering language preferences) and analytics. By clicking "Yes," I agree to these terms as well as Nova Amino\'s Terms of Service and Privacy Policy.'
]

const defaultSpanishParagraphs = [
  'Al ingresar a este sitio, confirmo que tengo al menos 21 años de edad y que soy un investigador calificado. Entiendo que todos los productos de Nova Amino se venden estrictamente para uso de investigación de laboratorio (RUO) y no están destinados al consumo humano o veterinario, ni para tratamiento médico o fines de diagnóstico.',
  'Reconozco que toda la información proporcionada es únicamente con fines educativos e informativos y no debe interpretarse como consejo médico. Acepto la responsabilidad total de cumplir con todas las leyes aplicables en mi jurisdicción y acepto liberar a Nova Amino de cualquier responsabilidad derivada del uso indebido de los productos.',
  'También autorizo el uso de cookies necesarias para las funciones esenciales del sitio (como recordar las preferencias de idioma) y con fines analíticos. Al hacer clic en "Sí", acepto estos términos, así como los Términos de Servicio y la Política de Privacidad de Nova Amino.'
]

export default defineType({
  name: 'accessConfirmation',
  title: 'Access Confirmation',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable Overlay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'minimumAge',
      title: 'Minimum Age Requirement',
      type: 'number',
      validation: (Rule) => Rule.required().min(18).max(25),
      initialValue: 21,
    }),
    defineField({
      name: 'rememberForDays',
      title: 'Remember decision for (days)',
      type: 'number',
      initialValue: 30,
      validation: (Rule) => Rule.min(1).max(365),
      description: 'How long to remember an accepted confirmation before asking again.',
    }),
    defineField({
      name: 'termsUrl',
      title: 'Terms of Service URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({allowRelative: true, scheme: ['http', 'https']}).warning('Use http(s) or relative URLs'),
      initialValue: '#',
    }),
    defineField({
      name: 'termsLabel',
      title: 'Terms of Service Label',
      type: 'string',
      initialValue: 'Terms of Service',
    }),
    defineField({
      name: 'privacyUrl',
      title: 'Privacy Policy URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({allowRelative: true, scheme: ['http', 'https']}).warning('Use http(s) or relative URLs'),
      initialValue: '#',
    }),
    defineField({
      name: 'privacyLabel',
      title: 'Privacy Policy Label',
      type: 'string',
      initialValue: 'Privacy Policy',
    }),
    defineField({
      name: 'declineRedirectUrl',
      title: 'Decline Redirect URL',
      type: 'url',
      description: 'Where visitors should be sent if they decline access. Leave blank to send them back to the previous page.',
      validation: (Rule) =>
        Rule.uri({allowRelative: true, scheme: ['http', 'https']}).warning('Use http(s) or relative URLs'),
      initialValue: 'https://www.google.com',
    }),
    defineField({
      name: 'successRedirectUrl',
      title: 'Success Redirect URL',
      type: 'url',
      description: 'Optional URL to redirect visitors to after they accept the terms.',
      validation: (Rule) =>
        Rule.uri({allowRelative: true, scheme: ['http', 'https']}).warning('Use http(s) or relative URLs'),
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Display Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'English',
            }),
            defineField({
              name: 'langCode',
              title: 'Language Code',
              type: 'string',
              description: 'Use a valid IETF language code (e.g., en, es, fr).',
              validation: (Rule) => Rule.required(),
              initialValue: 'en',
            }),
            defineField({
              name: 'title',
              title: 'Modal Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'Access Confirmation',
            }),
            defineField({
              name: 'paragraphs',
              title: 'Disclosure Paragraphs',
              type: 'array',
              of: [{type: 'text'}],
              validation: (Rule) => Rule.required().min(1).max(6),
            }),
            defineField({
              name: 'question',
              title: 'Acceptance Question',
              type: 'string',
              initialValue: 'Do you accept these terms?',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'acceptButtonLabel',
              title: 'Accept Button Label',
              type: 'string',
              initialValue: 'Yes, Enter Site',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'declineButtonLabel',
              title: 'Decline Button Label',
              type: 'string',
              initialValue: 'No, Exit',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'langCode',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1),
      initialValue: () => [
        {
          label: 'English',
          langCode: 'en',
          title: 'Access Confirmation',
          paragraphs: defaultEnglishParagraphs,
          question: 'Do you accept these terms?',
          acceptButtonLabel: 'Yes, Enter Site',
          declineButtonLabel: 'No, Exit',
        },
        {
          label: 'Español',
          langCode: 'es',
          title: 'Confirmación de Acceso',
          paragraphs: defaultSpanishParagraphs,
          question: '¿Acepta estos términos?',
          acceptButtonLabel: 'Sí, entrar al sitio',
          declineButtonLabel: 'No, salir',
        },
      ],
    }),
    defineField({
      name: 'defaultLanguage',
      title: 'Default Language Code',
      type: 'string',
      description: 'Leave blank to use the first language in the list.',
      initialValue: 'en',
    }),
  ],
  preview: {
    select: {
      title: 'languages.0.title',
      subtitle: 'languages.0.langCode',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Access Confirmation',
        subtitle: subtitle ? `Default language: ${subtitle}` : 'Configure access confirmation experience',
      }
    },
  },
})

