import type { Profile } from '$lib/entities/Profile';
import type { Session } from '@supabase/supabase-js';

interface ProfileValueObject extends Profile {
	id: string;
	student_id: string;
	student_name: string;
	avatar_url: string;
	updated_at: Date;
}

const updateProfileData = (session: Session, form: Profile): ProfileValueObject => {
	return {
		id: session?.user.id,
		student_name: form.student_name,
		student_id: form.student_id,
		updated_at: new Date(),
		avatar_url: form.avatar_url
	};
};

export { updateProfileData };

export type { ProfileValueObject };
