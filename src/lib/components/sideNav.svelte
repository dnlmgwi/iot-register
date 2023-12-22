<script>
  import Icon from "@iconify/svelte";
  import Area from "@iconify/icons-bx/area";
  
  let pen = 'mdi:pen';
</script>
<aside class="bg-blue-600 h-full">
  <div class="nav-link-with-icon">
    <Icon icon={pen} width="25" height="25"></Icon>
    <a class="nav-link" href="/">Check-In</a>
  </div>
  <div class="nav-link-with-icon">
    <Icon icon='solar:settings-linear' width="25" height="25"></Icon>
    <a class="nav-link" href="/settings">Settings</a>
  </div>
  </aside>
<style>

  .nav-link-with-icon {
    display: flex;
    flex-direction: row;
     padding: 1rem;
  }
 
  aside {
    width: 25%;
    display: flex;
    flex-direction: column;
  }

  .nav-link {
    margin-left: 0.4rem;
  }
</style>