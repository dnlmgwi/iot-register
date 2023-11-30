<script lang="ts">
  import CheckedIn from "./CheckedIn.svelte";
  import Searching from "./Searching.svelte";


  export let isSuccessful: boolean;
</script>

<div>
  {#if isSuccessful}
    <CheckedIn></CheckedIn>
  {:else}
    <Searching></Searching>
  {/if}
</div>
