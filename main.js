const mqtt = require('mqtt');
const fs = require('fs');

const options = {
    clientId: "clientId-walton-" + generateUUID(),
};

console.log(options.clientId);

const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", options);

client.on("connect", function () {
    console.log("Connected to mqtt client");
    // subscribe to Photos topic
    client.subscribe("birdFeeder$@NsCc&_%/Photos/#");
});

// process MQTT message
client.on('message', (topic, message) => {
    if (topic === "birdFeeder$@NsCc&_%/Photos") {
        // convert message to base64 encoded string
        const photoBase64 = message.toString();
        // convert base64 encoded string to buffer
        const imageBuffer = Buffer.from(photoBase64, 'base64');

        console.log(imageBuffer);
        // save image to local file
        fs.writeFile('../Python/destImages/image.jpg', imageBuffer, (err) => {
            if (err) {
                console.error('Error saving image:', err);
            } else {
                console.log('Image saved successfully');
            }
        });
    }
});

function generateUUID() {
    let uuid = '', i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }
    return uuid;
}