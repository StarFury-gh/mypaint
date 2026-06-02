import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Card } from "antd";

import {
  brush_icon,
  delete_icon,
  logout_icon,
} from "../../components/common/icons";

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

  const handleDelete = async (id: string) => {
    console.log(id);
    try {
      const { data } = await axios.delete(`${API_URL}/images/${id}`, {
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      });
      if (data.status) {
        setImages((prevImages) => prevImages.filter((img) => img.id !== id));
      }
    } catch (e) {
      console.error("Deleting image error:", e);
    }
  };

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
              MyPaint галерея пользователя{" "}
              <span className={styles["username"]}>{props.username}</span>
            </h1>
            <AppButton
              onClick={handleLogout}
              icon={<img src={logout_icon}></img>}
            >
              Выйти
            </AppButton>
          </div>
          <div className={styles["images-grid"]}>
            {images?.map((img) => {
              return (
                <Card
                  id={img.id}
                  title={
                    <div className={styles["card-title"]}>
                      <p>{img.title}</p>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className={styles["delete_btn"]}
                      >
                        <div className={styles["inner-icon"]}>
                          <img src={delete_icon} alt="" />
                        </div>
                      </button>
                    </div>
                  }
                >
                  <div className={styles["card-content"]}>
                    <img
                      className={styles["card-image"]}
                      src={`${IMAGES_URL}/${img.path}`}
                      alt="Не удалось загрузить ваше изображение."
                    />
                    <AppButton icon={<img src={brush_icon}></img>}>
                      Редактировать
                    </AppButton>
                  </div>
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
