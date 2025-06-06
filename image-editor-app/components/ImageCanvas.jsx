import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import '../src/Image.css'; 

const ImageCanvas = () => {
  const { filename } = useParams();
  const canvasRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/uploads/${filename}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer'
        });

        const img = new Image();
        const blob = new Blob([res.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        img.src = url;

        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          setImageLoaded(true);
        };
      } catch (error) {
        console.error('Error loading image', error);
      }
    };

    fetchImage();
  }, [filename]);

  return (
    <div className="canvas-page">
      {!imageLoaded && <p className="loading-text">Loading image...</p>}
      <canvas ref={canvasRef} className="canvas-box" />
    </div>
  );
};

export default ImageCanvas;
