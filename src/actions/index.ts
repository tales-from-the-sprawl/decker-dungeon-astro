import { ActionError, defineAction } from "astro:actions";
import { getEntry } from "astro:content";
import { z } from "astro:schema";

export const server = {
  nodePassword: defineAction({
    accept: "form",
    input: z.object({
      node: z.string(),
      password: z.string(),
      username: z.string().optional(),
    }),
    handler: async (input, context) => {
      const node = await getEntry("dungeon", input.node);
      if (node === undefined) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "not found",
        });
      }

      const session = (await context.session?.get(`node:${input.node}`)) ?? {
        granted: !node.data.password,
        retries: 0,
      };

      context.session?.set(`node:${input.node}`, session);

      if (session.granted) {
        return { granted: true };
      } else if (
        (!node.data.password || node.data.password === input.password) &&
        (!node.data.username || node.data.username === input.username)
      ) {
        session.granted = true;
        context.session?.set(`node:${input.node}`, session);

        return { granted: true };
      } else if (session.retries < (node.data.retries ?? 1)) {
        session.retries += 1;
        context.session?.set(`node:${input.node}`, session);
        throw new ActionError({
          code: "FORBIDDEN",
          message: node.data.error_to?.[session.retries - 1] ?? undefined,
        });
      } else {
        throw new ActionError({
          code: "FORBIDDEN",
          message: node.data.failure_to ?? undefined,
        });
      }
    },
  }),
};
