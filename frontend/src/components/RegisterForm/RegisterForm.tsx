import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link } from "react-router-dom";

import axios, { AxiosError } from "axios";
import { API_URL } from "../../constants";

import styles from "./RegisterForm.module.css";

function RegisterForm() {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errors, setErrors] = useState<{
    login?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    submit?: string;
  }>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!login.trim()) {
      newErrors.login = "Введите логин";
    } else if (login.length < 3) {
      newErrors.login = "Логин должен содержать минимум 3 символа";
    } else if (login.length > 20) {
      newErrors.login = "Логин не должен превышать 20 символов";
    }

    if (!password) {
      newErrors.password = "Введите пароль";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    } else if (password.length > 30) {
      newErrors.password = "Пароль не должен превышать 30 символов";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    return newErrors;
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        username: login,
        password,
      });

      if (response.status === 409) {
        setErrors({ login: "Пользователь с таким логином уже существует" });
        setIsLoading(false);
        return;
      }

      const { data } = response;
      setIsLoading(false);

      if (data.status) {
        localStorage.setItem("jwt", data.jwt);
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      } else {
        setErrors({ submit: "Ошибка регистрации" });
      }
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        if (e.response && e.response.status === 409) {
          setErrors({ login: "Пользователь с таким логином уже существует" });
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
    if (errors.password || errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
        confirmPassword: undefined,
      }));
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["panel"]}>
        <div className={styles["heading"]}>
          <h1 className={styles["title"]}>Регистрация</h1>
          <p className={styles["subtitle"]}>Создайте новый аккаунт</p>
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

          <div className={styles["formGroup"]}>
            <label htmlFor="confirmPassword" className={styles["label"]}>
              Подтверждение пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`${styles["input"]} ${errors.confirmPassword ? styles["inputError"] : ""}`}
              placeholder="Повторите пароль"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className={styles["errorMessage"]}>
                {errors.confirmPassword}
              </span>
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
              {isSuccess ? "Регистрация успешна!" : errors.submit}
            </div>
          )}

          <button
            type="submit"
            className={styles["submitButton"]}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles["loader"]}></span>
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>

        <div className={styles["registerLink"]}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
