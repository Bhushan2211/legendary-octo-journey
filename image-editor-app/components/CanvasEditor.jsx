import React, { useEffect, useRef, useState } from 'react';
import '../src/Canvas.css';

const CanvasEditor = ({ imageUrl, borders = [], onSave }) => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [points, setPoints] = useState(borders);
  const [selectedId, setSelectedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      drawCanvas(img, points);
    };
  }, [imageUrl, points]);

  const drawCanvas = (img, rects) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    rects.forEach((rect) => {
      ctx.strokeStyle = rect.id === selectedId ? 'red' : 'blue';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`Area: ${rect.area}`, rect.x + 4, rect.y + 14);

      
      ctx.fillStyle = 'yellow';
      ctx.fillRect(rect.x + rect.width - 6, rect.y + rect.height - 6, 6, 6);
    });
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const isInsideRect = (rect, x, y) =>
    x >= rect.x && x <= rect.x + rect.width &&
    y >= rect.y && y <= rect.y + rect.height;

  const isInResizeCorner = (rect, x, y) =>
    x >= rect.x + rect.width - 6 && x <= rect.x + rect.width &&
    y >= rect.y + rect.height - 6 && y <= rect.y + rect.height;

  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);

    for (let rect of points) {
      if (isInResizeCorner(rect, x, y)) {
        setSelectedId(rect.id);
        setIsResizing(true);
        return;
      }
      if (isInsideRect(rect, x, y)) {
        setSelectedId(rect.id);
        setIsDragging(true);
        setDragOffset({ x: x - rect.x, y: y - rect.y });
        return;
      }
    }

    setSelectedId(null);
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const { x, y } = getMousePos(e);
    setPoints(prevPoints => prevPoints.map(rect => {
      if (rect.id !== selectedId) return rect;

      if (isDragging) {
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;
        return { ...rect, x: newX, y: newY };
      }

      if (isResizing) {
        const newWidth = x - rect.x;
        const newHeight = y - rect.y;
        return {
          ...rect,
          width: newWidth,
          height: newHeight,
          area: newWidth * newHeight
        };
      }

      return rect;
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleDelete = () => {
    if (selectedId === null) return;
    const newPoints = points.filter(r => r.id !== selectedId);
    setPoints(newPoints);
    setSelectedId(null);
  };

  const handleSave = () => {
    onSave(points);
  };

  return (
    <div>
      <h3>Editor</h3>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ccc', cursor: 'pointer' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleSave}>💾 Save Borders</button>
        <button onClick={handleDelete} disabled={selectedId === null}>🗑️ Delete Selected</button>
      </div>
    </div>
  );
};

export default CanvasEditor;
