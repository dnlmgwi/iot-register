import { z } from 'zod';

export const profileSchema = z.object({
	student_name: z.string().min(5),
	student_id: z
		.string()
		.regex(/^P\d{8}$/, 'Student ID must start with P followed by 9 digits')
		.max(9),
	avatar_url: z.string()
});

export default profileSchema;
