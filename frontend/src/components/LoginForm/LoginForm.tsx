import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link } from "react-router-dom";

import axios, { AxiosError } from "axios";

import { API_URL } from "../../constants";
import styles from "./LoginForm.module.css";

function LoginForm() {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errors, setErrors] = useState<{
    login?: string;
    password?: string;
    submit?: string;
  }>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    // Валидация логина
    if (!login.trim()) {
      newErrors.login = "Введите логин";
    } else if (login.length < 3) {
      newErrors.login = "Логин должен содержать минимум 3 символа";
    }

    // Валидация пароля
    if (!password) {
      newErrors.password = "Введите пароль";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    return newErrors;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data } = await axios.post(`${API_URL}/users/login`, {
        username: login,
        password,
      });

      if (data.status) {
        localStorage.setItem("jwt", data.jwt);
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      } else {
        setErrors({
          submit: "Ошибка входа: " + (data.message || "неизвестная ошибка"),
        });
        setIsLoading(false);
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response && e.response.status === 401) {
          setErrors({ login: "Неверный логин или пароль" });
          setIsLoading(false);
          return;
        }
      }
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
    if (errors.login) {
      setErrors((prev) => ({ ...prev, login: undefined }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["panel"]}>
        <div className={styles["heading"]}>
          <h1 className={styles["title"]}>Вход в аккаунт</h1>
          <p className={styles["subtitle"]}>Добро пожаловать обратно!</p>
        </div>

        <form onSubmit={handleSubmit} className={styles["form"]}>
          <div className={styles["formGroup"]}>
            <label htmlFor="login" className={styles["label"]}>
              Логин
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={login}
              onChange={handleLoginChange}
              className={`${styles["input"]} ${errors.login ? styles["inputError"] : ""}`}
              placeholder="Введите ваш логин"
              disabled={isLoading}
            />
            {errors.login && (
              <span className={styles["errorMessage"]}>{errors.login}</span>
            )}
          </div>

          <div className={styles["formGroup"]}>
            <label htmlFor="password" className={styles["label"]}>
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className={`${styles["input"]} ${errors.password ? styles["inputError"] : ""}`}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
            {errors.password && (
              <span className={styles["errorMessage"]}>{errors.password}</span>
            )}
          </div>

          {(errors.submit || isSuccess) && (
            <div
              className={
                isSuccess
                  ? styles["successMessage"]
                  : errors.submit?.includes("успешно")
                    ? styles["successMessage"]
                    : styles["submitError"]
              }
            >
              {isSuccess ? "Вы успешно вошли в аккаунт!" : errors.submit}
            </div>
          )}

          <button
            type="submit"
            className={styles["submitButton"]}
            disabled={isLoading}
          >
            {isLoading ? <span className={styles["loader"]}></span> : "Войти"}
          </button>
        </form>

        <div className={styles["registerLink"]}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
