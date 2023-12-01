export const prerender = true;

import { superValidate } from "sveltekit-superforms/client";
import { z } from "zod";

export const _userSchema = z.object({
  studentNumber: z.string().min(5),
});

export const load = async ({  }) => {
  const form = await superValidate(_userSchema);

  return { form };
};
