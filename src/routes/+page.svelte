<script lang="ts">
  import { onMount } from "svelte";
  import { disconnect, sendData, connect } from "$lib/utils/ble.js";
  import toast, { Toaster } from "svelte-french-toast";
  import Searching from "$lib/components/Searching.svelte";
  import CheckedIn from "$lib/components/CheckedIn.svelte";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";
  import { _userSchema } from "./+page";
  import { checkInStore } from "$lib/stores/checkInStores";

  export let data: PageData;

  let device: unknown;

  $: isConnected = false;
  $: isSuccessful = false;
  $: canCheckInToday = false;

  const { form, errors, constraints, enhance, capture, restore } = superForm(
    data.form,
    {
      SPA: true,
      validators: _userSchema,
      applyAction: true,
      scrollToError: "smooth",
      autoFocusOnError: "detect",
      // On ActionResult error, render the nearest +error.svelte page
      onError: "apply",
      // No message when navigating away from a modified form
      onUpdate({ form }) {
        // Form validation
        if (form.valid) {
          // TODO: Do something with the validated form.data
          connectToDevice();
        }
      },
    }
  );

  export const snapshot = { capture, restore };

  const connectToDevice = async () => {
    try {
      if (!isConnected) {
        device = await connect();
        isConnected = true;
        await sendData($form.studentNumber).then(() => {
          isSuccessful = true;
          toast.success("Checked-In!");
          disconnect(device);
          isConnected = false;
        });
      } else {
        disconnect(device);
        toast.error("Something went wrong.");
        isConnected = false;
        isSuccessful = false;
      }
    } catch (error) {
      toast.error("Error connecting to BLE device.");
      disconnect(device);
      isConnected = false;
    }
  };

  onMount(() => {
    checkInStore.canCheckIn()
      ? (canCheckInToday = true)
      : (canCheckInToday = false);
  });
</script>

<main>
  <Toaster />
  <div class="flex flex-col items-center justify-center min-h-screen">
    <!-- Your centered content goes here -->
    <div class="p-8">
      {#if isSuccessful}
        <CheckedIn></CheckedIn>
      {:else}
        <Searching></Searching>
      {/if}
    </div>
    <form method="POST" use:enhance>
      <div class="space-y-12 w-full">
        <div class="border-b border-blue-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-blue-600">
            BLE Check-In
          </h2>
          <p class="mt-1 text-sm leading-6 text-blue-600">
            Please check-in as you enter class.
          </p>

          <div class="mt-7 grid grid-cols-1 gap-x-6 gap-y-8">
            <div class="sm:col-span-3">
              <label
                for="student-number"
                class="block text-sm font-medium leading-6 text-blue-500"
                >Student Number</label
              >
              <div class="mt-2">
                <input
                  type="text"
                  name="student-number"
                  id="student-number"
                  placeholder="Student Number"
                  bind:value={$form.studentNumber}
                  {...$constraints.studentNumber}
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
      </div>
    </form>
  </div>
</main>
