<script lang="ts">
	import { onMount } from 'svelte';
	import { disconnect, sendData, connect } from '$lib/utils/ble.js';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import BleStatus from '$lib/components/BLEStatus.svelte';
	import { checkedInStore, triggerReset } from '$lib/stores/checkedInStores';
	import { registerSchema } from '$lib/schemas/registerSchema';
	import { DiplomaClass } from '$lib/utils/geofencing.js';
	import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
	import { GetUserProfileUseCase } from '$lib/useCases/GetUserProfile.js';
	import { UpdateUserProfileUseCase as UpdateUserProfileUseCase } from '$lib/useCases/UpdateUserProfile.js';

	export let data: PageData;

	//Geo Fencing v0
	$: lat = 0;
	$: long = 0;

	let isOnCampus = 'Loading...';

	function success(position: any) {
		lat = position.coords.latitude;
		long = position.coords.longitude;

		if (DiplomaClass.inside(lat, long)) {
			isOnCampus = 'Yes You Are';
		} else {
			isOnCampus = 'Not Yet';
		}
	}

	function error() {
		toast.error('Sorry, no position available.');
	}

	const options = {
		enableHighAccuracy: true,
		maximumAge: 5000,
		timeout: 7000
	};

	onMount(() => {
		// Watch Live Location
		// navigator.geolocation.watchPosition(success, error, options);
		fetchUserProfile();
	});

	let device: unknown;

	$: isConnected = false;

	$: ({ session, supabase } = data);

	const userProfileRepository = new UserProfileRepository(supabase);
	const getUserProfile = new GetUserProfileUseCase(userProfileRepository);

	const fetchUserProfile = async () => {
		if (!session) {
			toast.error('Session not found');
		}

		try {
			const profile = await getUserProfile.execute(session.user.id);

			if (profile) {
				$form.student_id = profile.student_id; // Assuming 'data' is defined in your wider scope.
			} else {
				console.log('No profile found for the user:', session.user.id);
			}
		} catch (error) {
			toast.error('Please Update Profile');
		}
	};

	const { form, errors, constraints, enhance, capture, restore } = superForm(data.form, {
		SPA: true,
		validators: registerSchema,
		applyAction: true,
		taintedMessage: null,
		scrollToError: 'smooth',
		autoFocusOnError: 'detect',
		// On ActionResult error, render the nearest +error.svelte page
		onError: 'apply',
		// No message when navigating away from a modified form
		onUpdate({ form }) {
			// Form validation
			if (form.valid) {
				// TODO: Do something with the validated form.data
				connectToDevice();
			}
		}
	});

	export const snapshot = { capture, restore };

	const connectToDevice = async () => {
		try {
			if (!isConnected) {
				device = await connect();
				isConnected = true;
				//Better Waiting Experience
				toast.promise(
					sendData($form.student_id).then(() => {
						$checkedInStore = true;
						disconnect(device);
						isConnected = false;
						triggerReset(3000);
					}),
					{
						loading: 'Processing',
						success: 'Checked-In!',
						error: 'Please, Try Again'
					}
				);
			} else {
				disconnect(device);
				isConnected = false;
				$checkedInStore = false;
			}
		} catch (error) {
			toast.error('BLE Connection Failed');
			disconnect(device);
			isConnected = false;
		}
	};
</script>

<main>
	<Toaster />
	<div class="flex flex-col items-center justify-center min-h-screen">
		<div>
			{#if session != null}
				<div class="flex flex-col sm:flex-row items-center gap-2">
					<p class="text-base font-semibold leading-7 text-blue-600">
						You are logged in as {session.user.email}
					</p>
					<button
						on:click={() => supabase.auth.signOut()}
						class="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>Sign out</button
					>
				</div>
			{:else}
				<div class="flex flex-row items-center gap-2">
					<h2 class="text-base font-semibold leading-7 text-blue-600">View Your Track Record?</h2>
					<a
						href="auth"
						class="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>Sign In</a
					>
				</div>
			{/if}
		</div>
		<!-- Your centered content goes here -->
		<div class="p-8">
			<BleStatus isSuccessful={$checkedInStore}></BleStatus>
		</div>
		<form method="POST" use:enhance>
			<div class="space-y-12 w-full">
				<div class="border-b border-blue-900/10 pb-12">
					<h2 class="text-base font-semibold leading-7 text-blue-600">BLE Check-In</h2>
					<p class="mt-1 text-sm leading-6 text-blue-300">Please check-in as you enter class.</p>

					<div class="mt-7 grid grid-cols-1 gap-x-6 gap-y-8">
						<div class="sm:col-span-3">
							<label for="student_id" class="block text-sm font-medium leading-6 text-blue-500"
								>Student Number</label
							>
							<div class="mt-2">
								<input
									type="text"
									name="student_id"
									id="student_id"
									placeholder="P00"
									bind:value={$form.student_id}
									{...$constraints.student_id}
									class="block w-full rounded-md border-0 py-1.5 text-blue-500 shadow-sm ring-1 ring-inset ring-blue-300 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 flex items-center justify-center gap-x-6">
				<button
					class="rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					Check In</button
				>

				{#if session != null}
					<p>
						<a href="protected/profile" class="text-base font-semibold leading-7 text-blue-600"
							><button
								class="rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Profile</button
							></a
						>
					</p>
					<p>
						<a href="protected/stats" class="text-base font-semibold leading-7 text-blue-600"
							><button
								class="rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Stats</button
							></a
						>
					</p>
				{/if}
			</div>
		</form>
		<!-- <div class="select-none">
			<p class="mt-1 text-center font-medium leading-6 text-blue-500 pt-10">Are you on campus?</p>
			<p class="mt-1 text-center text-sm leading-6 text-blue-300">
				Lat: {lat}, Long: {long}
			</p>
			<p class="mt-1 text-center text-sm leading-6 text-blue-300">
				{isOnCampus}
			</p>
		</div> -->
	</div>
</main>
