import { writable } from "svelte/store";

export const checkedInStore = writable(false);
// export const checkInStore = createCheckInStore();

export function triggerReset(delay = 1000) {
  checkedInStore.set(true);

  setTimeout(() => {
    checkedInStore.set(false);
  }, delay);
}

// function createCheckInStore() {
//   var localStorage: any;
//   const { subscribe, set, update } = writable(getInitialCheckIns());

//   function getInitialCheckIns() {
//     if (typeof window !== "undefined") {
//       return JSON.parse(localStorage.getItem("checkIns")) || {};
//     }
//     return {};
//   }

//   function recordCheckIn() {
//     if (typeof window !== "undefined") {
//       const today = new Date().toISOString().split("T")[0];
//       update((checkIns) => {
//         if (!checkIns[today]) checkIns[today] = [];
//         checkIns[today].push(new Date().toISOString());
//         localStorage.setItem("checkIns", JSON.stringify(checkIns));
//         return checkIns;
//       });
//     }
//   }

//   function canCheckIn() {
//     if (typeof window !== "undefined") {
//       const today = new Date().toISOString().split("T")[0];
//       const checkIns = getInitialCheckIns();
//       return (checkIns[today] ? checkIns[today].length : 0) < 2;
//     }
//     return false;
//   }

//   return {
//     subscribe,
//     recordCheckIn,
//     canCheckIn,
//   };
// }
