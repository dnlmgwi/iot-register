const MAX_CHECKINS_PER_DAY = 2;

function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get date string in 'YYYY-MM-DD' format
}

function canCheckIn() {
    const todayString = getTodayDateString();
    const storedCheckIns = JSON.parse(localStorage.getItem('checkIns')) || {};

    if (!storedCheckIns[todayString]) {
        storedCheckIns[todayString] = [];
    }

    return storedCheckIns[todayString].length < MAX_CHECKINS_PER_DAY;
}

export function recordCheckIn() {
    if (canCheckIn()) {
        const todayString = getTodayDateString();
        const storedCheckIns = JSON.parse(localStorage.getItem('checkIns')) || {};

        if (!storedCheckIns[todayString]) {
            storedCheckIns[todayString] = [];
        }

        storedCheckIns[todayString].push(new Date().toISOString()); // Record the current time
        localStorage.setItem('checkIns', JSON.stringify(storedCheckIns));

        // Proceed with check-in logic
        // ...
    } else {
        console.log("Max check-ins reached for today.");
        // Handle the scenario when the user has already checked in twice
    }
}

// Usage
recordCheckIn();
