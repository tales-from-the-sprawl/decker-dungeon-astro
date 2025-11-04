import { defineAction } from "astro:actions";
import { getEntry } from "astro:content";
import { z } from "astro:schema";

export const server = {
  nodePassword: defineAction({
    accept: "form",
    input: z.object({
      node: z.string(),
      password: z.string(),
    }),
    handler: async (input, context) => {
      const node = await getEntry("dungeon", input.node);
      const session = (await context.session?.get(`node:${input.node}`)) ?? {};
      if (node === undefined) {
        return { error: "not found" };
      }
      if (!node.data.protect || node.data.protect.password === input.password) {
        session.granted = true;
        context.session?.set(`node:${input.node}`, session);
        return { granted: true };
      } else {
        return { error: "wrong password" };
      }
    },
  }),
  linkPassword: defineAction({
    accept: "form",
    input: z.object({
      node: z.string(),
      password: z.string(),
    }),
    handler: async (input, context) => {
      const node = await getEntry("dungeon", input.node);
      const session = (await context.session?.get(`node:${input.node}`)) ?? {};
      if (node === undefined) {
        return { error: "not found" };
      }
      if (!node.data.protect || node.data.protect.password === input.password) {
        session.granted = true;
        context.session?.set(`node:${input.node}`, session);
        return { granted: true };
      } else {
        return { error: "wrong password" };
      }
    },
  }),
};
