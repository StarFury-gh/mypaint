import React, { useState, useEffect, useRef } from "react";

import { ColorPicker, Slider } from "antd";

import { ToolButton } from "../../components/CanvasComponents";

import styles from "./DrawingPage.module.css";

import {
  save_icon,
  brush_icon,
  eraser_icon,
  eye_dropper_icon,
  clear_icon,
  upload_to_cloud,
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

  const handleColorChange = (_: unknown, css: string) => {
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

  const handleFill = () => {
    alert("Функция недоступна.");
    setCurrentTool("brush");
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
      handleFill();
    }
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
      const [r, g, b, a] = pixel.data;
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
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

  //Функция для сохранения рисунка на сервере
  const handleUploadToCloud = () => {
    console.log("Сохраняем на сервере...");
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
            <Slider
              defaultValue={5}
              onChange={(newSize) => setBrushSize(newSize)}
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
            <ToolButton
              currentTool={currentTool}
              toolName="brush"
              onClick={() => {
                handleToolChange("brush");
              }}
              icon={brush_icon}
            >
              Кисть
            </ToolButton>

            <ToolButton
              toolName="fill"
              onClick={() => handleToolChange("fill")}
              icon={fill_icon}
              disabled
            >
              Заливка
            </ToolButton>

            <ToolButton
              toolName="eraser"
              currentTool={currentTool}
              onClick={() => handleToolChange("eraser")}
              icon={eraser_icon}
            >
              Ластик
            </ToolButton>

            <ToolButton
              currentTool={currentTool}
              toolName="eyedropper"
              onClick={() => handleToolChange("eyedropper")}
              icon={eye_dropper_icon}
            >
              Пипетка
            </ToolButton>

            <ToolButton
              toolName="clearCanvas"
              onClick={handleClearCanvas}
              icon={clear_icon}
            >
              Очистить
            </ToolButton>

            <ToolButton onClick={handleSaveCanvas} icon={save_icon}>
              Сохранить
            </ToolButton>

            <ToolButton
              toolName="uploadToCloud"
              onClick={handleUploadToCloud}
              icon={upload_to_cloud}
            >
              В облако
            </ToolButton>
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
