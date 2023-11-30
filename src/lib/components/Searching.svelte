<script lang="ts">
  import Icon from "@iconify/svelte";
  import bluetoothIcon from "@iconify/icons-bx/bluetooth";
</script>

<div class="relative">
  <!-- Bottom Div -->

  <div
    class="w-48 h-48 flex items-center justify-center border border-blue-200 rounded-full animate-pulse"
  >
    <div
      class="w-32 h-32 flex items-center justify-center border border-blue-300 rounded-full animate-pulse"
    >
      <div
        class="w-24 h-24 flex items-center justify-center border border-blue-400 rounded-full animate-pulse"
      >
        <div
          class="w-16 h-16 flex items-center justify-center border border-blue-500 rounded-full animate-pulse"
        ></div>
      </div>
    </div>
  </div>

  <!-- Top Div -->
  <div
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
  >
    <Icon icon={bluetoothIcon} width="50" height="50" color="#3b82f6" />
  </div>
</div>
