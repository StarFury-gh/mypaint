import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Имитация API запроса
    setTimeout(() => {
      // Здесь добавьте реальную логику входа
      if (login === "admin" && password === "123456") {
        console.log("Успешный вход:", { login, password });
        alert("Добро пожаловать!");
        // Перенаправление после успешного входа
        // navigate('/dashboard');
      } else {
        setErrors({ submit: "Неверный логин или пароль" });
      }
      setIsLoading(false);
    }, 1500);
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

          {errors.submit && (
            <div className={styles["submitError"]}>{errors.submit}</div>
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
