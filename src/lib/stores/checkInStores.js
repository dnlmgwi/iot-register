import { writable } from 'svelte/store';

function createCheckInStore() {
    const { subscribe, set, update } = writable(getInitialCheckIns());

    function getInitialCheckIns() {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('checkIns')) || {};
        }
        return {};
    }

    function recordCheckIn() {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            update((checkIns) => {
                if (!checkIns[today]) checkIns[today] = [];
                checkIns[today].push(new Date().toISOString());
                localStorage.setItem('checkIns', JSON.stringify(checkIns));
                return checkIns;
            });
        }
    }

    function canCheckIn() {
        if (typeof window !== 'undefined') {
            const today = new Date().toISOString().split('T')[0];
            const checkIns = getInitialCheckIns();
            return (checkIns[today] ? checkIns[today].length : 0) < 2;
        }
        return false;
    }

    return {
        subscribe,
        recordCheckIn,
        canCheckIn,
    };
}

export const checkInStore = createCheckInStore();
