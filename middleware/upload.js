const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    console.warn('⚠️ Cloudinary not configured. Using local storage fallback.');
    
   
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    
    const upload = multer({ storage: storage });
    module.exports = upload;
} else {
   
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'brio-bite',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        }
    });
    
    const upload = multer({ storage: storage });
    module.exports = upload;
}