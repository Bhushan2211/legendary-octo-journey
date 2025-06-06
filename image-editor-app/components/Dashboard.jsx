import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import CanvasEditor from '../components/CanvasEditor';
import '../src/Dashboard.css';

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('/images');
        const baseURL = import.meta.env.VITE_API_BASE_URL.replace('/api', ''); 
        const imagesWithUrls = res.data.map(img => ({
          ...img,
          url: `${baseURL}/uploads/${img.filename}`
        }));
        setImages(imagesWithUrls);
      } catch (err) {
        alert('Failed to fetch images');
      }
    };
    fetchImages();
  }, []);

  const saveBorders = async (imageId, points) => {
    try {
      const res = await axios.put('/images/borders', { imageId, borders: points });
      alert("Borders Saved");
      
      setImages(prev =>
        prev.map(img =>
          img._id === imageId ? { ...img, borders: points } : img
        )
      );
    } catch (err) {
      alert("Failed to save borders");
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`/images/${imageId}`);
      alert("Image deleted");
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      if (selectedImage && selectedImage._id === imageId) setSelectedImage(null);
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Uploaded Images</h2>
      <div className="dashboard-image-grid">
        {images.map((img) => (
          <div key={img._id} className="thumbnail-wrapper">
            <img
              src={img.url}
              alt="uploaded"
              className="thumbnail"
              onClick={() => setSelectedImage(img)}
            />
            <button
              className="delete-button"
              onClick={() => deleteImage(img._id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {selectedImage && (
        <CanvasEditor
          imageUrl={selectedImage.url}
          borders={selectedImage.borders}
          onSave={(points) => saveBorders(selectedImage._id, points)}
        />
      )}
    </div>
  );
};

export default Dashboard;
