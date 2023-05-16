const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const imageDirectory = './images';

// Set API routes
app.get('/api/images', (req, res) => {
    // read image directory
    fs.readdir(imageDirectory, (err, files) => {
        if (err) {
            console.error('Error reading image directory:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // order files by modified time
        files.sort((a, b) => {
            const fileA = fs.statSync(path.join(imageDirectory, a));
            const fileB = fs.statSync(path.join(imageDirectory, b));
            return fileB.mtime.getTime() - fileA.mtime.getTime();
        });

        // Get the latest 5 pictures
        const latestImages = files.slice(0, 5).map(file => ({
            filename: file,
            filepath: path.join(imageDirectory, file),
            filetime: fs.statSync(path.join(imageDirectory, file)).mtime.getTime()
        }));

        res.json({ images: latestImages });
    });
});

// start API server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});