import React, { useState, useEffect, useRef } from "react";

import { ColorPicker } from "antd";

import styles from "./DrawingPage.module.css";

import {
  save_icon,
  brush_icon,
  eraser_icon,
  eye_dropper_icon,
  clear_icon,
  fill_icon,
} from "../../components/icons";

type DrawingTools = "brush" | "eraser" | "eyedropper" | "fill";

function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("rgba(125, 125, 125, 1)");

  const [currentTool, setCurrentTool] = useState<DrawingTools>("brush");

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

  const handleColorChange = (color: unknown, css: string) => {
    setBrushColor(css);
  };

  // Функция обработчик рисования линии с текущим инструментом
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (currentTool === "eraser") {
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y);
    context.stroke();
  };

  // Функция для рисования инструментом
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

  // Определяем что делать, относительно текущего инструмента
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === "eyedropper") {
      const color = getColorAtPosition(e);
      if (color) {
        setBrushColor(color);
        setCurrentTool("brush");
      }
    } else if (currentTool === "brush" || currentTool === "eraser") {
      startDrawing(e);
    } else if (currentTool === "fill") {
      handleFill(e);
    }
  };

  // Обработчик заливки
  const handleFill = (e: React.MouseEvent<HTMLCanvasElement>) => {
    alert("Функция сейчас не доступна");
    console.log(e.clientX, e.clientY);
    setCurrentTool("brush");
  };

  // Обрабатываем конец рисования
  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.beginPath();
  };

  // Для получения цвета в месте клика по холсту
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

  // Полная очистка холста
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Функция для сохранения холста как файла
  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Функция для смены инструмента
  const handleToolChange = (tool: DrawingTools) => {
    setCurrentTool(tool);
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
          <div className={styles["setting"]}>
            <label>Цвет кисти: </label>
            <ColorPicker
              value={brushColor}
              onChange={handleColorChange}
            ></ColorPicker>
          </div>
          <div className={styles["alternative_buttons"]}>
            <button
              onClick={() => {
                handleToolChange("brush");
              }}
              className={`${styles["alternative_btn"]} ${currentTool === "brush" ? styles["active"] : ""}`}
            >
              <div className={styles["btn_content"]}>
                <p>Кисть</p>
                <img src={brush_icon} alt="" />
              </div>
            </button>

            <button
              onClick={() => {
                handleToolChange("fill");
              }}
              className={`${styles["alternative_btn"]} ${currentTool === "fill" ? styles["active"] : ""}`}
            >
              <div className={styles["btn_content"]}>
                <p>Заливка</p>
                <img src={fill_icon} alt="" />
              </div>
            </button>

            <button
              onClick={() => {
                handleToolChange("eraser");
              }}
              className={`${styles["alternative_btn"]} ${currentTool === "eraser" ? styles["active"] : ""}`}
            >
              <div className={styles["btn_content"]}>
                <p>Ластик</p>
                <img src={eraser_icon} alt="" />
              </div>
            </button>

            <button
              className={`${currentTool === "eyedropper" ? styles["active"] : ""} ${styles["alternative_btn"]}`}
              onClick={() => {
                setCurrentTool("eyedropper");
              }}
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
          <div className={styles["inner_box"]}>
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
