<script lang="ts">
	import { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
	import { UploadProfilePictureUseCase } from '$lib/useCases/UploadProfilePicture';
	import { createEventDispatcher } from 'svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { DownloadImageUseCase } from '$lib/useCases/GetUserProfilePicture';
	import toast from 'svelte-french-toast';
	import { GetPublicUrlUseCase } from '$lib/useCases/GetPublicUrl';

	export let size = 10;
	export let url: string;
	export let supabase: SupabaseClient;
	export let userId: string;

	let uploading = false;
	let files: FileList;

	const dispatch = createEventDispatcher();

	const userProfileRepository = new UserProfileRepository(supabase);
	const uploadProfilePicture = new UploadProfilePictureUseCase(userProfileRepository);
	// const downloadProfilePicture = new DownloadImageUseCase(userProfileRepository);
	const getPublicUrl = new GetPublicUrlUseCase(userProfileRepository);

	// const downloadImage = async (path: string) => {
	// 	try {
	// 		const publicUrl = await getPublicUrl.execute(path);

	// 		if (!publicUrl) {
	// 			throw Error('File Not Found');
	// 		}

	// 		url = publicUrl;

	// 		avatarUrl = publicUrl;
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			console.log('Error downloading image: ', error.message);
	// 			toast.error(error.message);
	// 		}
	// 	}
	// };

	function triggerFileInput() {
		const fileInput = document.getElementById('single');
		if (fileInput !== null) {
			// Checks if the element exists
			fileInput.click();
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		// Check if the Enter or Space key was pressed
		if (event.key === 'Enter' || event.key === ' ') {
			triggerFileInput();
		}
	}

	const uploadAvatar = async () => {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = files[0];
			const data = await uploadProfilePicture.execute(userId, file);
			const publicUrl = await getPublicUrl.execute(data);

			url = publicUrl;

			setTimeout(() => {
				dispatch('upload', { publicUrl });
			}, 100);

			toast('Profile Picture Uploaded', { icon: '✅' });
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			uploading = false;
		}
	};

	// $: if (url) downloadImage(url);
</script>

<div>
	<input type="hidden" name="avatar_url" value={url} />

	<!-- File input for uploading images -->
	<div class="w-[10em]">
		<div>
			{#if url}
				<div
					role="button"
					tabindex="0"
					class="w-[{size}em] h-[{size}em] bg-gray-200 flex justify-center items-center cursor-pointer rounded-full"
					style="background-image: url({url}); background-size: cover; height: {size}em; width: {size}em;"
					on:click={triggerFileInput}
					on:keypress={handleKeyPress}
					aria-controls=""
				>
					{#if !url}
						<span class="text-gray-500">{uploading ? 'Uploading ...' : 'Upload Image'}</span>
					{/if}
				</div>
			{:else}
				<div
					role="button"
					tabindex="0"
					on:click={triggerFileInput}
					on:keypress={handleKeyPress}
					aria-controls=""
					class="w-[{size}em] h-[{size}em] bg-gray-200 flex justify-center items-center cursor-pointer rounded-full"
					style="height: {size}em; width: {size}em;"
				>
					<span class="text-blue-600">{uploading ? 'Uploading ...' : 'Upload Image'}</span>
				</div>
			{/if}
		</div>

		<label class="button primary block text-blue-600 cursor-pointer" for="single"> </label>
		<input
			class="hidden absolute"
			type="file"
			id="single"
			accept="image/jpeg"
			bind:files
			on:change={uploadAvatar}
			disabled={uploading}
		/>
	</div>
</div>
