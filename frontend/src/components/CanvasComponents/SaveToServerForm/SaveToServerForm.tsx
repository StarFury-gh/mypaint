import { useState, useEffect, type ChangeEvent, type SubmitEvent } from "react";
import axios from "axios";

import { Select } from "antd";

import { AppInput } from "../../common";
import { close_icon } from "../../common/icons";
import { API_URL } from "../../../constants";

import styles from "./SaveToServerForm.module.css";

interface SaveToServerFormProps {
  onClose?: () => void;
  imageData?: string;
  imgTitle?: string;
  imgId?: string;
}

interface Errors {
  title?: string;
}

interface SavingOption {
  label: string;
  value: string;
}

function SaveToServerForm(props: SaveToServerFormProps) {
  const [paintingTitle, setPaintingTitle] = useState<string>(
    props.imgTitle ? `Измененный рисунок: ${props.imgTitle}` : "",
  );
  const [paintingData, setPaintingData] = useState<string>(
    props.imageData || "",
  );
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [savingType, setSavingType] = useState("save");

  const savingOptions: Array<SavingOption> = [
    {
      label: "Сохранить в облаке",
      value: "save",
    },
    {
      label: "Обновить изображение",
      value: "update",
    },
  ];

  useEffect(() => {
    const handleLoad = () => {
      setPaintingData(props.imageData || "");
    };
    handleLoad();
  }, [props.imageData]);

  const handlePaintingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaintingTitle(e.target.value);
  };

  const handleSavingTypeChange = (value: string) => {
    setSavingType(value);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (sent) {
      return;
    }
    setErrors({});
    if (!paintingTitle) {
      setErrors({
        title: "Введите название рисунка",
      });
      return;
    }
    if (!paintingData) {
      alert("Ошибка! Не удалось сохранить изображение");
    }

    const jwt = localStorage.getItem("jwt");

    try {
      if (savingType === "save") {
        await axios.post(
          `${API_URL}/images/upload`,
          {
            title: paintingTitle,
            img: paintingData,
          },
          {
            headers: {
              Authorization: jwt || "",
            },
          },
        );
        setSuccessMessage("Изображение успешно сохранено!");
        setSent(true);
        setTimeout(() => {
          setSuccessMessage("");
          if (props.onClose) {
            props.onClose();
          }
        }, 2000);
      } else if (savingType === "update") {
        const { data } = await axios.patch(
          `${API_URL}/images/update`,
          {
            img: paintingData,
            id: props.imgId,
            new_title: paintingTitle,
          },
          {
            headers: {
              Authorization: jwt || "",
            },
          },
        );
        if (data.status) {
          setErrors({});
          setSuccessMessage("Изображение обновлено.");
          setSent(true);
          setTimeout(() => {
            setSuccessMessage("");
            if (props.onClose) {
              props.onClose();
            }
          }, 2000);
        }
      }
    } catch (e) {
      console.error("Saving image error:", e);
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 401) {
          setErrorMessage(
            "Ошибка авторизации. Пожалуйста, войдите в систему снова.",
          );
        } else if (status === 500) {
          setErrorMessage("Внутренняя ошибка сервера. Попробуйте позже.");
        } else if (status === 422) {
          setErrorMessage(
            "Изображение для обновления не найдено. Попробуйте сохранить",
          );
        } else {
          setErrorMessage("Неизвестная ошибка при сохранении изображения.");
        }
      }
    }
  };

  return (
    <form className={styles["form"]} onSubmit={handleSubmit}>
      <div className={styles["close"]}>
        <button
          type="button"
          className={styles["close_btn"]}
          onClick={props.onClose}
        >
          <div className={styles["inner_icon"]}>
            <img src={close_icon} alt="" />
          </div>
        </button>
      </div>
      <h2 className={styles["form_title"]}>Сохранить изображение в облако</h2>
      <div className={styles["preview"]}>
        <p className={styles["text"]}>Вы пытаетесь сохранить:</p>
        <img src={props.imageData} alt="" />
      </div>
      <div className={styles["params"]}>
        <p className={styles["text"]}>Параметры изображения:</p>
        <AppInput
          hasError={!!errors.title}
          label={!errors.title ? "Название рисунка" : errors.title}
          placeholder="Название рисунка"
          value={paintingTitle}
          onChange={handlePaintingChange}
        />
      </div>
      <div className={styles["btns"]}>
        <div className={styles["saving_type"]}>
          <label htmlFor="">Я хочу: </label>
          <Select
            style={{ width: 300 }}
            onChange={handleSavingTypeChange}
            options={savingOptions}
            defaultValue={savingOptions[0].value}
          ></Select>
        </div>
      </div>
      <button className={styles["form_btn"]}>Сохранить</button>
      {successMessage && (
        <div className={styles["success_message"]}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={styles["error_message"]}>{errorMessage}</div>
      )}
    </form>
  );
}

export default SaveToServerForm;
