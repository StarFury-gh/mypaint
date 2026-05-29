import { useState, useEffect, useRef } from "react";

import styles from "./DrawingPage.module.css";

import eraser_icon from "/eraser.svg";
import eye_dropper_icon from "/eyedropper.svg";
import clear_icon from "/clear.svg";
import save_icon from "/save.svg";

function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [isEyeDropperActive, setIsEyeDropperActive] = useState(false);
  const [eraserActive, setEraserActive] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = brushColor;
  }, [brushSize, brushColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (eraserActive) {
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y);
    context.stroke();
  };

  const handleSetEraser = () => {
    setEraserActive(!eraserActive);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isEyeDropperActive) {
      const color = getColorAtPosition(e);
      if (color) {
        setBrushColor(color);
        setIsEyeDropperActive(false);
      }
    } else {
      startDrawing(e);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.beginPath();
  };

  const getColorAtPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const context = canvas.getContext("2d");
    if (!context) return null;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    if (
      canvasX >= 0 &&
      canvasX < canvas.width &&
      canvasY >= 0 &&
      canvasY < canvas.height
    ) {
      const pixel = context.getImageData(canvasX, canvasY, 1, 1);
      const [r, g, b] = pixel.data;
      // Конвертируем RGB в HEX
      const hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return hex;
    }
    return null;
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["items"]}>
        <div className={styles["side_panel"]}>
          <div className={styles["canvas_settings"]}>
            <label>Размер кисти: </label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
            <span>{brushSize}px</span>
          </div>
          <div>
            <label>Цвет кисти: </label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
            />
          </div>
          <div className={styles["alternative_buttons"]}>
            <button
              onClick={handleSetEraser}
              className={`${styles["alternative_btn"]} ${eraserActive ? styles["active"] : ""}`}
            >
              <div className={styles["btn_content"]}>
                <p>Ластик</p>
                <img src={eraser_icon} alt="" />
              </div>
            </button>
            <button
              className={`${isEyeDropperActive ? styles["active"] : ""} ${styles["alternative_btn"]}`}
              onClick={() => setIsEyeDropperActive(!isEyeDropperActive)}
            >
              <div className={styles["btn_content"]}>
                <p>Пипетка</p>
                <img src={eye_dropper_icon} alt="" />
              </div>
            </button>
            <button
              className={styles["alternative_btn"]}
              onClick={handleClearCanvas}
            >
              <div className={styles["btn_content"]}>
                <p>Очистить</p>
                <img src={clear_icon} alt="" />
              </div>
            </button>
            <button
              className={styles["alternative_btn"]}
              onClick={handleSaveCanvas}
            >
              <div className={styles["btn_content"]}>
                <p>Сохранить</p>
                <img src={save_icon} alt="" />
              </div>
            </button>
          </div>
        </div>
        <div className={styles["canvas_box"]}>
          <div className="">
            <canvas
              className={styles["canvas"]}
              ref={canvasRef}
              width={1200}
              height={800}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawingPage;
