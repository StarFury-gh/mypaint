import React, { useState, useEffect, useRef } from "react";

import { ColorPicker, Slider, InputNumber } from "antd";

import {
  SaveToServerForm,
  ToolButton,
  ColorButton,
} from "../../components/CanvasComponents";
import { AppPopup } from "../../components/common";
import { API_URL, IMAGES_URL } from "../../constants";
import { type DrawingTools } from "../../types/drawing/tools";

import styles from "./DrawingPage.module.css";

import {
  save_icon,
  brush_icon,
  eraser_icon,
  eye_dropper_icon,
  clear_icon,
  upload_to_cloud,
  fill_icon,
  square_icon,
  circle_icon,
  text_icon,
  reset_colors_icon,
  new_image_icon,
} from "../../components/common/icons";

const MAX_BRUSH_SIZE = 150;
const MIN_BRUSH_SIZE = 1;

const STANDARD_BLUE = "#6c6cd7";
const STANDARD_RED = "#d76c6c";
const STANDARD_GRAY = "#4c4c4c";

const EMPTY_PALETTE = Array(16)
  .fill(null)
  .map((_, idx) => {
    if (idx == 0) {
      return STANDARD_BLUE;
    } else if (idx == 1) {
      return STANDARD_RED;
    }
  });

type PaletteColor = string | null | "#6c6cd7" | "#d76c6c" | undefined;

interface ServerImageInfo {
  author_id: string;
  created_at: string;
  id: string;
  path: string;
  title: string;
  updated_at: string;
}

interface GetImageServerResponse {
  image: ServerImageInfo;
}

function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState(STANDARD_GRAY);
  const [currentTool, setCurrentTool] = useState<DrawingTools>("brush");

  const [editingImageID] = useState<string | null>(
    localStorage.getItem("editingImageID"),
  );

  const [imgInfo, setImgInfo] = useState<{
    id?: string;
    title?: string;
  }>();

  const [prevColors, setPrevColors] =
    useState<Array<PaletteColor>>(EMPTY_PALETTE);

  const [currentImage, setCurrentImage] = useState<string>();

  const [savePopupOpen, setSavePopupOpen] = useState<boolean>(false);
  const currentPositionRef = useRef<{ x: number; y: number } | null>(null);

  const handleSizeChange = (value: number | null) => {
    if (value) {
      setBrushSize(value);
    } else {
      setBrushSize(1);
    }
  };

  // Состояния для фигур
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  useEffect(() => {
    const getImage = async () => {
      if (editingImageID) {
        const response = await fetch(`${API_URL}/images/${editingImageID}`, {
          headers: {
            Authorization: localStorage.getItem("jwt") || "",
          },
        });
        const data: GetImageServerResponse = await response.json();
        setImgInfo({ title: data.image.title, id: data.image.id });
        console.log(data);
        const imageUrlObject = `${IMAGES_URL}/${data.image.path}`;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const context = canvas.getContext("2d");
          if (!context) return;

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = imageUrlObject;
      } else {
        console.log("Создание нового изображения");
      }
    };
    getImage();
  }, [editingImageID]);

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

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentPositionRef.current = { x, y };

    draw(e);
  };

  // Функция для начала рисования квадрата
  const handleSquareDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapeStart({ x, y });

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setSnapshot(imageData);

    setIsDrawing(true);
  };

  // Функция для отрисовки квадрата в реальном времени
  const drawSquare = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !shapeStart || !snapshot) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Восстанавливаем сохраненный снимок холста
    context.putImageData(snapshot, 0, 0);

    const width = currentX - shapeStart.x;
    const height = currentY - shapeStart.y;

    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = "square";
    context.lineJoin = "miter";

    context.beginPath();
    context.rect(shapeStart.x, shapeStart.y, width, height);
    context.stroke();

    context.lineCap = "round";
    context.lineJoin = "round";
  };

  // Функция для начала рисования окружности
  const handleCircleDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapeStart({ x, y });

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setSnapshot(imageData);

    setIsDrawing(true);
  };

  // Функция для отрисовки окружности в реальном времени (с сохранением пропорций)
  const drawCircle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !shapeStart || !snapshot) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Восстанавливаем сохраненный снимок холста
    context.putImageData(snapshot, 0, 0);

    // Вычисляем радиус как расстояние от центра до текущей позиции
    const dx = currentX - shapeStart.x;
    const dy = currentY - shapeStart.y;
    const radius = Math.sqrt(dx * dx + dy * dy);

    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;

    context.beginPath();
    // Рисуем окружность с центром в начальной точке
    context.arc(shapeStart.x, shapeStart.y, radius, 0, 2 * Math.PI);
    context.stroke();
  };

  // Функция для начала рисования эллипса
  const handleEllipseDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapeStart({ x, y });

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setSnapshot(imageData);

    setIsDrawing(true);
  };

  // Функция для отрисовки эллипса в реальном времени (без сохранения пропорций)
  const drawEllipse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !shapeStart || !snapshot) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    context.putImageData(snapshot, 0, 0);

    // Центр эллипса
    const centerX = (shapeStart.x + currentX) / 2;
    const centerY = (shapeStart.y + currentY) / 2;

    // Радиусы по X и Y
    const radiusX = Math.abs(currentX - shapeStart.x) / 2;
    const radiusY = Math.abs(currentY - shapeStart.y) / 2;

    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;

    context.beginPath();
    // Рисуем эллипс
    context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    context.stroke();
  };

  // Функция обработчик рисования линии с текущим инструментом
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!prevColors.some((color) => color === brushColor)) {
      const updatedPrevColors = prevColors.slice(0, prevColors.length - 1);
      setPrevColors([brushColor, ...updatedPrevColors]);
    }
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Вызываем соответствующую функцию в зависимости от инструмента
    if (currentTool === "square") {
      handleSquareDrawing(e);
      return;
    }

    if (currentTool === "circle") {
      handleCircleDrawing(e);
      return;
    }

    if (currentTool === "ellipse") {
      handleEllipseDrawing(e);
      return;
    }

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

  // Функция для рисования
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Проверяем, какой инструмент активен и вызываем соответствующую функцию
    if (currentTool === "square" && isDrawing) {
      drawSquare(e);
      return;
    }

    if (currentTool === "circle" && isDrawing) {
      drawCircle(e);
      return;
    }

    if (currentTool === "ellipse" && isDrawing) {
      drawEllipse(e);
      return;
    }

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentPositionRef.current = { x, y };

    // Ваш существующий код обработки инструментов
    if (currentTool === "eyedropper") {
      const color = getColorAtPosition(e);
      if (color) {
        setBrushColor(color);
        setCurrentTool("brush");
      }
    } else if (
      currentTool === "brush" ||
      currentTool === "square" ||
      currentTool === "circle" ||
      currentTool === "ellipse"
    ) {
      startDrawing(e);
    } else if (currentTool === "eraser") {
      startDrawing(e);
    }
  };

  // Обрабатываем конец рисования
  const stopDrawing = async () => {
    setIsDrawing(false);

    // Сбрасываем состояние фигур
    setShapeStart(null);
    setSnapshot(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    if (currentTool === "eraser") {
      context.globalCompositeOperation = "source-over";
    }

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

  // Функция для очистки предыдущих цветов
  const handleClearPrevColors = () => {
    setPrevColors(EMPTY_PALETTE);
  };

  // Функция для сохранения рисунка как файла
  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "MyPaint_рисунок.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  //Функция для сохранения рисунка на сервере
  const handleUploadToCloud = () => {
    console.log("Сохраняем на сервере...");
    const img = canvasRef.current?.toDataURL("image/png");
    setCurrentImage(img);
    setSavePopupOpen(true);
  };

  // Функция для смены инструмента
  const handleToolChange = (tool: DrawingTools) => {
    setCurrentTool(tool);
  };

  // Функция для начала нового рисунка
  const handleStartNewDrawing = () => {
    localStorage.removeItem("editingImageID");
    setImgInfo({});
    handleClearCanvas();
  };

  return (
    <div className={styles["container"]}>
      <AppPopup
        isOpen={savePopupOpen}
        onClose={() => setSavePopupOpen(false)}
        content={
          <SaveToServerForm
            imgId={imgInfo?.id}
            imgTitle={imgInfo?.title}
            onClose={() => setSavePopupOpen(false)}
            imageData={currentImage}
          />
        }
      ></AppPopup>
      <div className={styles["items"]}>
        <div className={styles["side_panel"]}>
          <div className={styles["canvas_settings"]}>
            <label>Размер кисти: </label>
            <Slider
              defaultValue={5}
              min={MIN_BRUSH_SIZE}
              max={MAX_BRUSH_SIZE}
              onChange={handleSizeChange}
              value={brushSize}
            />
            <div className={styles["input_size"]}>
              <InputNumber
                max={MAX_BRUSH_SIZE}
                min={MIN_BRUSH_SIZE}
                value={brushSize}
                onChange={handleSizeChange}
              />
              <p>px</p>
            </div>
          </div>
          <div className={styles["color_pick"]}>
            <div className={styles["setting"]}>
              <label>Цвет кисти: </label>
              <ColorPicker
                value={brushColor}
                onChange={handleColorChange}
              ></ColorPicker>
            </div>
            <p>Предыдущие цвета:</p>
            <div className={styles["prev_colors"]}>
              {prevColors.map((color, idx) => {
                return (
                  <ColorButton
                    key={idx}
                    onClick={() => {
                      setBrushColor(color || "null");
                    }}
                    color={color}
                  ></ColorButton>
                );
              })}
            </div>
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
              onClick={() => {
                setCurrentTool("square");
              }}
              toolName="square"
              currentTool={currentTool}
              icon={square_icon}
            >
              Квадрат
            </ToolButton>

            <ToolButton
              onClick={() => {
                setCurrentTool("circle");
              }}
              toolName="circle"
              icon={circle_icon}
              currentTool={currentTool}
            >
              Круг
            </ToolButton>

            <ToolButton
              toolName="ellipse"
              onClick={() => setCurrentTool("ellipse")}
              currentTool={currentTool}
              icon={circle_icon}
            >
              Эллипс
            </ToolButton>

            <ToolButton
              onClick={() => {
                setCurrentTool("text");
              }}
              currentTool={currentTool}
              toolName="text"
              icon={text_icon}
              disabled
            >
              Текст
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
              onClick={handleClearPrevColors}
              icon={reset_colors_icon}
            >
              Очистить цвета
            </ToolButton>

            <ToolButton
              toolName="clearCanvas"
              onClick={handleClearCanvas}
              icon={clear_icon}
            >
              Очистить
            </ToolButton>
          </div>
          <div className={styles["save"]}>
            <ToolButton onClick={handleSaveCanvas} icon={save_icon}>
              Сохранить
            </ToolButton>

            {imgInfo?.title ? (
              <ToolButton
                onClick={() => {
                  handleStartNewDrawing();
                }}
                icon={new_image_icon}
              >
                Начать новый рисунок
              </ToolButton>
            ) : null}

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
              height={1080}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
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
