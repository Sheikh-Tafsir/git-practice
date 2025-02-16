import React, { useRef, useState } from "react";
import Tesseract from "tesseract.js";

const HandwritingCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize canvas
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Convert canvas to image and process with OCR
  const handleOCR = async () => {
    setLoading(true);
    setText("");

    const canvas = canvasRef.current;
    const imageURL = canvas.toDataURL("image/png");

    try {
      const { data } = await Tesseract.recognize(imageURL, "eng", {
        logger: (m) => console.log(m), // Logs progress
      });
      setText(data.text);
    } catch (error) {
      console.error("OCR Error:", error);
      setText("Error recognizing text");
    }

    setLoading(false);
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setText(""); // Reset text output
  };

  return (
    <div className="p-4 max-w-lg mx-auto text-center">
      <h2 className="text-lg font-bold mb-2">Write with Mouse</h2>
      
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="border border-gray-300 bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Buttons */}
      <div className="mt-4">
        <button
          onClick={handleOCR}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Convert to Text"}
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </div>

      {/* Output Text */}
      {text && <p className="mt-4 p-2 bg-gray-100 rounded">{text}</p>}
    </div>
  );
};

export default HandwritingCanvas;
