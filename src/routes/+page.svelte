<script lang="ts">
  import { onMount } from "svelte";
  import { disconnect, sendData, connect } from "$lib/utils/ble.js";
  import toast, { Toaster } from "svelte-french-toast";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";
  import { _userSchema } from "./+page";
  import BleStatus from "$lib/components/BLEStatus.svelte";
  import { checkedInStore, triggerReset } from "$lib/stores/checkedInStores";
  import { DiplomaClass } from "$lib/utils/geofencing";

  export let data: PageData;

  let device: unknown;

  $: lat = 0;
  $: long = 0;

  let isOnCampus = "Loading...";

  function success(position: any) {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    if (DiplomaClass.inside(lat, long)) {
     isOnCampus = "Yes You Are";
    } else {
      isOnCampus = "Not Yet";
    }
  }

  function error() {
    toast.error("Sorry, no position available.");
  }

  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
  };

  $: isConnected = false;

  onMount(() => {
    // Watch Live Location
    navigator.geolocation.watchPosition(success, error, options);
  });

  const { form, errors, constraints, enhance, capture, restore } = superForm(
    data.form,
    {
      SPA: true,
      validators: _userSchema,
      applyAction: true,
      taintedMessage: null,
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
          $checkedInStore = true;
          toast.success("Checked-In!");
          disconnect(device);
          isConnected = false;

          triggerReset(3000);
        });
      } else {
        disconnect(device);
        isConnected = false;
        $checkedInStore = false;
      }
    } catch (error) {
      toast.error("Error connecting to BLE device.");
      disconnect(device);
      isConnected = false;
    }
  };
</script>

<main>
  <Toaster />
  <p class="mt-1 text-center font-medium leading-6 text-blue-500 pt-10">
    Are you on campus?
  </p>
  <p class="mt-1 text-center text-sm leading-6 text-blue-300">
    Lat: {lat}, Long: {long}
  </p>
  <p class="mt-1 text-center text-sm leading-6 text-blue-300">
   {isOnCampus}
  </p>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <!-- Your centered content goes here -->
    <div class="p-8">
      <BleStatus isSuccessful={$checkedInStore}></BleStatus>
    </div>
    <form method="POST" use:enhance>
      <div class="space-y-12 w-full">
        <div class="border-b border-blue-900/10 pb-4">
          <h2 class="text-base font-semibold leading-7 text-blue-600">
            BLE Check-In
          </h2>
          <p class="mt-1 text-sm leading-6 text-blue-300">
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
                  placeholder="P00"
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
