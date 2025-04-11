export const API_KEY = 'AIzaSyBzduQ_d5JNQX6Qr-ROU4xEChLeIRSrOKM'

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