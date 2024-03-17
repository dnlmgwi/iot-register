import { writable } from "svelte/store";

export const checkedInStore = writable(false);

export function triggerReset(delay = 1000) {
  checkedInStore.set(true);

  setTimeout(() => {
    checkedInStore.set(false);
  }, delay);
}