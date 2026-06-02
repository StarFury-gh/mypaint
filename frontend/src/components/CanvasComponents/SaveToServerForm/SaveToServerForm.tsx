import { useState, useEffect, type ChangeEvent, type SubmitEvent } from "react";

import { AppInput } from "../../common";
import { close_icon } from "../../common/icons";

import styles from "./SaveToServerForm.module.css";

interface SaveToServerFormProps {
  onClose?: () => void;
  imageData?: string;
}

interface Errors {
  title?: string;
}

function SaveToServerForm(props: SaveToServerFormProps) {
  const [paintingTitle, setPaintingTitle] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {}, [props.imageData]);

  const handlePaintingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaintingTitle(e.target.value);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!paintingTitle) {
      setErrors({
        title: "Введите название рисунка",
      });
      return;
    }
    console.log("Отправляем на сервер...");
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
      <button type="submit" className={styles["form_btn"]}>
        Сохранить
      </button>
    </form>
  );
}

export default SaveToServerForm;
