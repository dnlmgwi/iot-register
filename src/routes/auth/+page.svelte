<script lang="ts">
	import { page } from '$app/stores';
	import { Auth } from '@supabase/auth-ui-svelte';

	$: next = $page.url.searchParams.get('next');

	$: redirectTo = next
		? `${$page.url.origin}/auth/callback?next=${encodeURIComponent(next)}`
		: `${$page.url.origin}/auth/callback`;
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen">
	<div>
		<div class="flex flex-row items-center gap-2">
			<h2 class="text-base font-semibold leading-7 text-blue-600">Just Need to Check-In?</h2>
			<a
				href="/"
				class="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>Check-In</a
			>
		</div>
	</div>
	<div class="text-base font-semibold text-blue-600">
		<Auth
			supabaseClient={$page.data.supabase}
			theme="dark"
			view="magic_link"
			{redirectTo}
			showLinks={false}
			additionalData={{}}
		/>
	</div>
</div>
