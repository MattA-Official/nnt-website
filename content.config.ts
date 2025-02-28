import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        pages: defineCollection({
            // Load every markdown file inside the `content` directory
            source: {
                include: '**/*.md',
                exclude: ['wiki/**/*.md', 'navigation/**/*.md', 'data/**/*.md']
            },
            type: 'page',
        }),
        navigation: defineCollection({
            source: 'navigation/**.yml',
            type: 'data',
            schema: z.object({
                links: z.array(z.object({
                    text: z.string(),
                    url: z.string(),
                    button: z.boolean().optional(),
                    type: z.string().optional(),
                })),
                socials: z.array(z.object({
                    icon: z.string(),
                    url: z.string()
                })).optional(),
                legal: z.object({
                    copyright: z.string(),
                    privacy: z.string().optional(),
                    terms: z.string().optional(),
                }).optional(),
            })
        }),
        committee: defineCollection({
            source: 'data/committee.yml',
            type: 'data',
            schema: z.object({
                committee: z.array(z.object({
                    role: z.string(),
                    name: z.string(),
                    email: z.string(),
                    image: z.string(),
                    rollover: z.string().optional(),
                    group: z.string().optional(),
                    alias_email: z.string().optional(),
                    alias_role: z.string().optional(),
                    pronouns: z.string().optional(),
                    bio: z.string().optional(),
                    alt_email: z.string().optional(),
                })),
                groups: z.array(z.object({
                    name: z.string(),
                    email: z.string().optional(),
                    roles: z.array(z.string())
                }))
            })
        }),
    }
})