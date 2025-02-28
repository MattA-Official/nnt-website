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
        committee: defineCollection({
            source: '_data/committee.yml',
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