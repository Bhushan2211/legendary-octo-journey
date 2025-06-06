const Sharp = require('sharp');
const Image = require('../models/Image');
const user = require('../models/User');

exports.uploadImage = async (req, res) => {
  try {
    const filepath = req.file.path;

    const metadata = await Sharp(filepath).metadata();

    // Mock edge detection: return bounding box as full image
    const borders = [{
      id: Date.now(), 
      x: 0,
      y: 0,
      width: metadata.width,
      height: metadata.height,
      area: metadata.width * metadata.height
    }];

    const newImage = new Image({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      width: metadata.width,
      height: metadata.height,
      borders
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch images' });
  }
};

exports.updateBorders = async (req, res) => {
  const { imageId, borders } = req.body;
  try {
    const image = await Image.findOneAndUpdate(
      { _id: imageId, user: req.user.id },
      { borders },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update borders' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await Image.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete image' });
  }
};
