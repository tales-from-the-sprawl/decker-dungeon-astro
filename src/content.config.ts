import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { getSecret } from "astro:env/server";
import { join } from "node:path";

const contentFolder = getSecret("BASE_CONTENT_FOLDER") || "./src/content";

const protectSchema = z.object({
  password: z.string(),
  prompt: z.string(),
  retry: z.number().optional(),
  failed_to: z.string().optional(),
});

const dungeon = defineCollection({
  loader: glob({
    base: join(contentFolder, "dungeon"),
    pattern: "**/*.{md,mdx}",
  }),
  schema: () =>
    z.object({
      links: z
        .array(
          z.object({
            to: z.string(),
            label: z.string(),
            protect: protectSchema.optional(),
          })
        )
        .optional(),
      protect: protectSchema.optional(),
    }),
});

export const collections = { dungeon };
