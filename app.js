// app.js

const express = require('express');
const multer = require('multer');
const azure = require('azure-storage');
const { Readable } = require('stream');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

console.log('Connection String:', process.env.AZURE_STORAGE_CONNECTION_STRING);
console.log(typeof(process.env.AZURE_STORAGE_CONNECTION_STRING))
const blobService = azure.createBlobService('imagecontainer1', process.env.AZURE_STORAGE_CONNECTION_STRING);


// Middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, '', 'index.html')));

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// POST endpoint for image upload
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        const blobName = req.file.originalname;
        const stream = getStream(req.file.buffer);

        blobService.createBlockBlobFromStream(process.env.AZURE_STORAGE_CONTAINER_NAME, blobName, stream, req.file.size, (error, result, response) => {
            if (error) {
                console.error('Error uploading file:', error);
                return res.status(500).json({ error: true, message: 'Error uploading file to Azure Blob Storage' });
            }

            const imageUrl = blobService.getUrl(process.env.AZURE_STORAGE_CONTAINER_NAME, blobName);
            res.status(200).json({ imageUrl: imageUrl });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

function getStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
