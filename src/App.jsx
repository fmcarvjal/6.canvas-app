import React, { useRef, useState, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Button } from 'react-bootstrap';

const App = () => {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.8);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.9);
  const [brushSize, setBrushSize] = useState(5);

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleColorChange = (color) => {
    setBrushColor(color);
  };

  const handleImageChange = (event) => {
    if (!isImageLoaded) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
        setIsImageLoaded(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const colors = [
    ['#000000', '#ff0000', '#00ff00', '#0000ff'],
    ['#ffff00', '#ff00ff', '#00ffff', '#800080'],
    ['#008000', '#808000', '#800000', '#008080']
  ];

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth * 0.8);
      setCanvasHeight(window.innerHeight * 0.9);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {colors.map((columnColors, columnIndex) => (
            <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column' }}>
              {columnColors.map((color) => (
                <Button key={color} variant="primary" onClick={() => handleColorChange(color)} style={{ marginBottom: '10px', width: '40px', height: '40px', background: color }}></Button>
              ))}
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          {isImageLoaded ? (
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 0,
                width: '100%',
                height: '95%',
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
              }}
            />
          ) : null}
          <CanvasDraw
            ref={canvasRef}
            brushColor={brushColor}
            brushRadius={brushSize}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            hideInterface ={false}// Oculta la interfaz predeterminada (gota que sigue al cursor)
          />
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Button variant="danger" onClick={handleClearCanvas} style={{ margin: '0 10px' }}>Clear</Button>
          <Button variant="warning" onClick={handleUndo} style={{ margin: '0 10px' }}>Undo</Button>
          <input
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>Brush Size: {brushSize}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
