import type profileSchema from '$lib/schemas/profileSchema';
import type { z } from 'zod';

type Profile = z.infer<typeof profileSchema>;

export type { Profile };
