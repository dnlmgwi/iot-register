<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import profileSchema from '$lib/schemas/profileSchema';
	import toast from 'svelte-french-toast';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	let disableName: boolean;
	let disableID: boolean;

	const { form, errors, enhance, constraints, delayed } = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		validators: profileSchema,
		multipleSubmits: 'abort',
		scrollToError: 'smooth',
		autoFocusOnError: 'detect',
		// SPA: true,
		onError: 'apply',
		stickyNavbar: 'true',
		onUpdated({ form }) {
			if (form.valid) {
				// Successful post! Do some more client-side stuff,
				// like showing a toast notification.
				toast('Profile Updated', { icon: '✅' });
				loading = false;
				disableName = true;
				disableID = true;
			}

			if (!form.valid) {
				if ($form.avatar_url == '') {
					toast.error('Please Upload An Image');
				}

				loading = false;
			}
		}
	});

	let loading = false;

	// disableName = $form.student_name !== null;
	// disableID = $form.student_id !== null;
	let disableEmail = true;

	function handleSubmit() {
		loading = true;
		return async () => {
			loading = false;
		};
	}

	$: {
		if (data.profile) {
			$form = data.profile;
		}
	}

	function handleUpload(event: CustomEvent) {
		$form.avatar_url = event.detail.url; // Update the parent's variable with the new URL
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<div class="p-10">
		<div class="flex justify-center items-center h-full">
			<div class="flex justify-center">
				<form
					class="form-widget"
					method="post"
					action="?/update"
					use:enhance
					on:submit|preventDefault={handleSubmit}
				>
					<div class="border-b border-gray-900/10 pb-12">
						<h2 class="text-base font-semibold leading-7 text-blue-600">Profile</h2>
						<p class="mt-1 text-base leading-7 text-blue-600">
							This information will be used to track your overall class attendance.
						</p>
						<div class="my-3">
							<Avatar
								userId={data.session.user.id}
								supabase={data.supabase}
								bind:url={$form.avatar_url}
								size={10}
								on:upload={() => {
									handleUpload;
								}}
							/>
						</div>
						<div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
							<div class="sm:col-span-3">
								<label for="student_name" class="block text-sm font-medium leading-6 text-blue-600"
									>Full name</label
								>
								<div class="mt-2">
									<input
										type="text"
										id="student_name"
										name="student_name"
										autocomplete="given-name"
										aria-invalid={$errors.student_name ? 'true' : undefined}
										bind:value={$form.student_name}
										{...$constraints.student_name}
										class="block w-full rounded-md border-0 py-1.5 text-blue-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div class="sm:col-span-3">
								<label for="student_id" class="block text-sm font-medium leading-6 text-blue-600"
									>Student Number</label
								>
								<div class="mt-2">
									<input
										type="text"
										id="student_id"
										name="student_id"
										class="block w-full rounded-md border-0 py-1.5 text-blue-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
										aria-invalid={$errors.student_id ? 'true' : undefined}
										bind:value={$form.student_id}
										{...$constraints.student_id}
									/>
								</div>
							</div>

							<div class="sm:col-span-3 select-none">
								<label for="email" class="block text-sm font-medium leading-6 text-blue-600"
									>Email Address</label
								>
								<div class="mt-2">
									<input
										value={data.session.user.email}
										disabled={disableEmail}
										id="email"
										name="email"
										type="email"
										autocomplete="email"
										class="block cursor-not-allowed select-none w-full rounded-md border-0 py-1.5 text-blue-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-6 flex items-center justify-between gap-x-6">
						<input
							type="submit"
							class="rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							value={loading ? 'Loading...' : 'Update'}
							disabled={loading}
						/>
						<a href="/" class="text-base font-semibold leading-7 text-blue-600"
							><button
								class="rounded-full border-2 border-blue-600 px-6 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
							>
								Back</button
							></a
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
