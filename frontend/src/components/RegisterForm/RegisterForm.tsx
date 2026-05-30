import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link } from "react-router-dom";

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      newErrors.password =
        "Пароль должен содержать хотя бы одну заглавную и одну строчную букву";
    }

    // Валидация подтверждения пароля
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

    setTimeout(() => {
      console.log("Регистрация:", { login, password });
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

          {errors.submit && (
            <div className={styles["submitError"]}>{errors.submit}</div>
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
