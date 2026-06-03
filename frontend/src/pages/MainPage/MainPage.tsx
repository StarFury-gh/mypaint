import { Link } from "react-router-dom";

import styles from "./MainPage.module.css";

const FEATURES = [
  "🖌️ Кисти",
  "🔷 Фигуры",
  "🎚️ Слои (в разработке)",
  "💧 Заливка (в разработке)",
  "📝 Текст (в разработке)",
  "🌈 Градиенты (в разработке)",
];

function MainPage() {
  return (
    <div className={styles["container"]}>
      {/* Hero блок */}
      <section className={styles["hero"]}>
        <h1 className={styles["title"]}>Рисуйте в браузере без установок</h1>
        <p className={styles["subtitle"]}>
          MyPaint — инструмент для создания графических рисунков онлайн.
        </p>
        <div className={styles["heroButtons"]}>
          <Link
            to="/draw"
            className={`${styles["buttonPrimary"]} ${styles["link"]}`}
          >
            Открыть редактор
          </Link>
          <Link
            to="/about"
            className={`${styles["buttonSecondary"]} ${styles["link"]}`}
          >
            Узнать больше
          </Link>
        </div>
      </section>

      {/* Возможности редактора */}
      <section className={styles["features"]}>
        <h2 className={styles["sectionTitle"]}>Возможности редактора</h2>
        <p className={styles["featuresText"]}>
          Полный набор растровых инструментов: кисти, слои, пипетка, заливка,
          текст, фигуры, градиенты и фильтры. Мгновенный старт без регистрации.
        </p>
        <div className={styles["featuresGrid"]}>
          {FEATURES.map((feature, idx) => {
            return (
              <div key={idx} className={styles["featureCard"]}>
                {feature}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className={styles["cta"]}>
        <h2 className={styles["ctaTitle"]}>Попробовать прямо сейчас</h2>
        <div className={styles["ctaButtons"]}>
          <Link
            to="/draw"
            className={`${styles["buttonPrimary"]} ${styles["link"]}`}
          >
            Открыть редактор
          </Link>
          <Link
            to="/register"
            className={`${styles["buttonSecondary"]} ${styles["link"]}`}
          >
            Зарегистрироваться, чтобы включить облачное хранилище
          </Link>
        </div>
      </section>

      {/* Облачное хранилище */}
      <section className={styles["cloud"]}>
        <h2 className={styles["sectionTitle"]}>Облачное хранилище</h2>
        <p className={styles["cloudText"]}>
          Ваши рисунки можно сохранить в облаке. Открывайте проекты на любом
          устройстве, продолжайте работу с любого места.
        </p>
      </section>

      {/* Условие использования облака */}
      <section className={styles["warning"]}>
        <div className={styles["warningBox"]}>
          ⚠️
          <p className={styles["warningText"]}>
            Чтобы пользоваться облачным хранилищем данных (сохранение,
            синхронизация, доступ к файлам с разных устройств),
            <strong> необходимо авторизоваться</strong>. Без авторизации рисунки
            будут храниться локально в браузере.
          </p>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
