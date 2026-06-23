import { defineCollection, z } from 'astro:content';

const locales = ['de', 'en'] as const;

function i18n<T extends z.ZodTypeAny>(schema: T) {
  return z.object({ de: schema, en: schema });
}

const featureCard = z.object({ icon: z.string(), title: z.string(), text: z.string() });
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
      address: z.string(),
      email: z.string(),
      phone: z.string(),
      map_embed_url: z.string().optional(),
    })),
  }),

  press: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      press_releases: z.array(z.object({ date: z.string(), title: z.string(), file_url: z.string().optional() })),
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
      features: z.array(featureItem),
      pricing_note: z.string().optional(),
    })),
  }),

  eventspace: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro: z.string(),
      features: z.array(featureItem),
      pricing_note: z.string().optional(),
    })),
  }),

  childcare: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro: z.string(),
      features: z.array(featureItem),
      pricing_note: z.string().optional(),
    })),
  }),

  virtualoffice: defineCollection({
    type: 'data',
    schema: i18n(z.object({
      headline: z.string(),
      intro: z.string(),
      features: z.array(featureItem),
      pricing_note: z.string().optional(),
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
