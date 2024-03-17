import { z } from 'zod';

export const registerSchema = z.object({
	student_id: z
		.string()
		.regex(/^P\d{8}$/, 'Student ID must start with P followed by 9 digits')
		.max(9)
});
