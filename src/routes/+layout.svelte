<script>
  import SideNav from "$lib/components/sideNav.svelte";
  import "../app.css";
</script>

<svelte:head>
  <script
    async
    defer
    src="https://www.google.com/recaptcha/api.js?render={import.meta.env
      .VITE_SITEKEY}"
  >
  </script>
</svelte:head>

  <section><slot /></section>
