<script>
  import SideNav from "$lib/components/sideNav.svelte";
import "../app.css";
</script>

<svelte:head>
  <script async defer src="https://www.google.com/recaptcha/api.js?render={import.meta.env.VITE_SITEKEY}">
  </script>
</svelte:head>

<div class="container">

<SideNav></SideNav>
<section><slot /></section>

</div>

<style>
  .container{
    display: flex;
    height: 100vh;
    width: 100vw;
  }
  
  aside {
    background-color: grey;
    width: 25%;
    display: flex;
    flex-direction: column;
  }

  .nav-link {
    padding: 1rem;

  }

  
  section {
    width: 100%;
  }
</style>