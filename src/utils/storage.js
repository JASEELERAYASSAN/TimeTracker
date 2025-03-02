import AsyncStorage from "@react-native-async-storage/async-storage";

const TIMER_KEY = 'timers';
const COMPLETED_TIMER_KEY = 'completedTimers';

export const storeTimer = async (timer) => {
    try {
        const timers = JSON.parse(await AsyncStorage.getItem(TIMER_KEY)) || [];
        const index = timers.findIndex(t => t.name === timer.name);

        if (index === -1) {
            timers.push(timer);
        } else {
            timers[index] = timer;
        }
        await AsyncStorage.setItem(TIMER_KEY, JSON.stringify(timers));
    } catch(e) {
        console.error('Failed to store timer', e);
    }
};

export const getTimers = async () => {
    try {
        return JSON.parse(await AsyncStorage.getItem(TIMER_KEY)) || [];
    } catch(e) {
        console.error('Failed to fetch timers', e);
    }
};

export const storeCompletedTimer = async (completedTimer) => {
    try {
        const history = JSON.parse(await AsyncStorage.getItem(COMPLETED_TIMER_KEY)) || [];
        history.push(completedTimer);
        await AsyncStorage.setItem(COMPLETED_TIMER_KEY, JSON.stringify(history));
    } catch(e) {
        console.error('Failed to store completed timer', e);
    }
};

export const getCompletedTimers = async () => {
    try {
        return JSON.parse(await AsyncStorage.getItem(COMPLETED_TIMER_KEY)) || [];
    } catch(e) {
        console.error('Failed to fetch completed timers', e);
        return [];
    }
};