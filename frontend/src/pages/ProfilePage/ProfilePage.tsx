import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Card } from "antd";

import { brush_icon } from "../../components/common/icons";

import styles from "./ProfilePage.module.css";
import { API_URL, IMAGES_URL } from "../../constants";
import { AppButton } from "../../components/common";

interface Image {
  id: string;
  title: string;
  path: string;
}

interface ProfilePageProps {
  authStatus: boolean;
  username?: string;
}

function ProfilePage(props: ProfilePageProps) {
  const [images, setImages] = useState<Array<Image>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(!props.authStatus);

  useEffect(() => {
    const getImages = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/images/`, {
          headers: {
            Authorization: localStorage.getItem("jwt"),
          },
        });
        console.log(data);
        setImages(data.images);
        setError(null);
        setIsUnauthorized(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setIsUnauthorized(true);
          setImages([]);
        } else {
          setError("Не удалось загрузить изображения");
          setImages([]);
        }
        console.error(error);
      }
    };
    getImages();
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
    localStorage.clear();
  };

  return (
    <div className={styles["container"]}>
      {isUnauthorized && (
        <div className={styles["error-message"]}>
          Вы не авторизованы
          <div className={styles["link-container"]}>
            <Link to="/login" className={styles["link"]}>
              Войти
            </Link>
            <span className={styles["separator"]}> или </span>
            <Link to="/register" className={styles["link"]}>
              Зарегистрироваться
            </Link>
          </div>
        </div>
      )}
      {error && <div className={styles["error-message"]}>{error}</div>}
      {!isUnauthorized && (
        <div className={styles["items"]}>
          <div className={styles["profile-info"]}>
            <h1 className={styles["page-title"]}>
              Профиль MyPaint пользователя{" "}
              <span className={styles["username"]}>{props.username}</span>
            </h1>
            <button className={styles["logout-button"]} onClick={handleLogout}>
              Выйти
            </button>
          </div>
          <div className={styles["images-grid"]}>
            {images?.map((img) => {
              console.log(`${IMAGES_URL}/${img.path}`);
              return (
                <Card title={img.title}>
                  <img
                    className={styles["card-image"]}
                    src={`${IMAGES_URL}/${img.path}`}
                    alt="Не удалось загрузить ваше изображение."
                  />
                  <AppButton icon={<img src={brush_icon}></img>}>
                    Редактировать
                  </AppButton>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
