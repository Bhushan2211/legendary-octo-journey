const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const {
  uploadImage,
  getImages,
  updateBorders,
  deleteImage
} = require('../controllers/imageController');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', auth, upload.single('image'), uploadImage);
router.get('/', auth, getImages);
router.put('/borders', auth, updateBorders);
router.delete('/:id', auth, deleteImage);
module.exports = router;
