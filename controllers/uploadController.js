const path = require('path')
// const blobService = require('.services/azureConnection');

exports.getHomePage = async (req, res)=>
{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
}
exports.uploadImage = async (req, res) => {
    // app.post('/upload', upload.single('image'), (req, res) => {
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
    
    
    function getStream(buffer) {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
}