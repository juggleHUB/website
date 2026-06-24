import { defineCollection, z } from 'astro:content';

const locales = ['de', 'en'] as const;

function i18n<T extends z.ZodTypeAny>(schema: T) {
  return z.object({ de: schema, en: schema });
}

const featureCard = z.object({ title: z.string(), text: z.string(), url: z.string() });
const carouselItem = z.object({ image: z.string(), title: z.string(), description: z.string() });
const testimonial = z.object({ text: z.string(), name: z.string() });
const featureItem = z.object({ title: z.string(), text: z.string(), image: z.string().optional() });
const teamMember = z.object({ name: z.string(), role: z.string(), bio: z.string(), image: z.string().optional() });

export const collections = {
  home: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      hero_headline: z.string(),
      hero_subtext: z.string(),
      hero_cta_label: z.string(),
      hero_cta_url: z.string(),
      welcome_title: z.string(),
      welcome_text: z.string(),
      feature_cards: z.array(featureCard),
      carousel_items: z.array(carouselItem),
      testimonials_title: z.string(),
      testimonials_description: z.string(),
      testimonials: z.tuple([testimonial, testimonial, testimonial]),
    })),
  }),

  about: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro_text: z.string(),
    })),
  }),

  ourstory: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      body: z.string(),
    })),
  }),

  faq: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      items: z.array(z.object({ question: z.string(), answer: z.string() })),
    })),
  }),

  contact: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      location_title: z.string(),
      name: z.string(),
      address: z.string(),
      tram: z.string(),
      hours: z.string(),
      hours_note: z.string(),
      email_general: z.string(),
      email_childcare: z.string(),
      email_space: z.string(),
      phone: z.string(),
    })),
  }),

  press: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      press_releases: z.array(z.object({ date: z.string(), title: z.string(), button_text: z.string().optional(), url: z.string().optional() })),
    })),
  }),

  team: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      members: z.array(teamMember),
    })),
  }),

  coworking: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro: z.string(),
      hero_cta_label: z.string().optional(),
      hero_cta_url: z.string().optional(),
      welcome_title: z.string().optional(),
      welcome_text: z.string().optional(),
      cards: z.array(z.object({ title: z.string(), text: z.string(), url: z.string().optional(), image: z.string().optional() })).optional(),
      features: z.array(featureItem),
      pricing_note: z.string().optional(),
      pricing: z.object({
        title: z.string(),
        description: z.string().optional(),
        notes: z.array(z.string()).optional(),
        cards: z.array(z.object({
          title: z.string(),
          price: z.number(),
          currency: z.string().optional(),
          period: z.string().optional(),
          vat_note: z.string().optional(),
          features: z.array(z.string()),
        })),
      }).optional(),
    })),
  }),

  eventspace: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro: z.string(),
      hero_cta_label: z.string().optional(),
      hero_cta_url: z.string().optional(),
      welcome_title: z.string().optional(),
      welcome_text: z.string().optional(),
      rooms: z.array(z.object({
        title: z.string(),
        description: z.string(),
        images: z.array(z.string()),
      })).optional(),
      pricing: z.object({
        title: z.string(),
        cta_label: z.string().optional(),
        cta_url: z.string().optional(),
        cards: z.array(z.object({
          title: z.string(),
          price: z.number(),
          period: z.string().optional(),
          features: z.array(z.string()),
        })),
      }).optional(),
    })),
  }),

  childcare: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro: z.string(),
      hero_cta_label: z.string().optional(),
      hero_cta_url: z.string().optional(),
      welcome_title: z.string().optional(),
      welcome_text: z.string().optional(),
      carousel_items: z.array(z.object({ image: z.string(), title: z.string(), description: z.string() })).optional(),
      pricing: z.object({
        title: z.string(),
        notes: z.array(z.string()).optional(),
        cards: z.array(z.object({
          title: z.string(),
          price: z.number(),
          period: z.string().optional(),
          vat_note: z.string().optional(),
          features: z.array(z.string()),
        })),
      }).optional(),
    })),
  }),

  virtualoffice: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro: z.string(),
      hero_cta_label: z.string().optional(),
      hero_cta_url: z.string().optional(),
      pricing: z.array(z.object({
        title: z.string(),
        from: z.string(),
        sub: z.string(),
        items: z.array(z.string()),
        extras: z.array(z.string()),
      })),
      form_title: z.string(),
      form_name: z.string(),
      form_email: z.string(),
      form_company: z.string(),
      form_package: z.string(),
      form_package_options: z.array(z.string()),
      form_message: z.string(),
      form_submit: z.string(),
    })),
  }),

  pages: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      title: z.string(),
      body: z.string(),
    })),
  }),
};
