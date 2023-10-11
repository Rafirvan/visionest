


export default function getRandomHexColor() {
    const midHighHexChars = '56789';  // Middle to higher half of the hex spectrum

    let color = '#';

    // Randomly select one primary color to be dominant (vibrant)
    const dominantColor = Math.floor(Math.random() * 3); // 0 for Red, 1 for Green, 2 for Blue

    for (let i = 0; i < 6; i++) {
        let randomIndex;

        // Make the dominant color component high for vibrancy
        if (i === dominantColor * 2 || i === dominantColor * 2 + 1) {
            color += "f";
        } else {
            randomIndex = Math.floor(Math.random() * midHighHexChars.length);
            color += midHighHexChars[randomIndex];
        }
    }

    return color;
}


