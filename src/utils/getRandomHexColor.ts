

export default function getRandomHexColor() {
    const hexChars = '89abcdef';  // Only using the higher half of the hex spectrum for lighter colors
    let color = '#';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * hexChars.length);
        color += hexChars[randomIndex];
    }

    return color;
}