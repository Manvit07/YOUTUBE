export const API_KEY = import.meta.env.VITE_YOUTUBE_API

export const ValueConverter = (value) => {
    if (value >= 1000000) {
        return Math.floor(value / 1000000) + "M";
    }
    else if (value >= 1000) {
        return Math.floor(value / 1000) + "k";
    }
    else {
        return value;
    }
}