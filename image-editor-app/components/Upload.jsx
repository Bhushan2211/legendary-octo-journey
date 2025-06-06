import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../src/Upload.css'; 

const Upload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Select a file first.");

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post('/images/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Uploaded: ${res.data.filename}`);
      navigate('/dashboard');
    } catch {
      alert('Upload failed');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Image</h2>
      <input
        type="file"
        className="file-input"
        onChange={e => setFile(e.target.files[0])}
        accept="image/*"
      />
      <button className="upload-button" onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
