import { Link } from "react-router-dom";
import styles from "./AppHeader.module.css";

function AppHeader() {
  return (
    <header className={styles["header"]}>
      <nav>
        <ul className={styles["links"]}>
          <li>
            <Link to="/" className={styles["link"]}>
              MyPaint
            </Link>
          </li>
          <li>
            <Link to="/draw" className={styles["link"]}>
              Новый холст
            </Link>
          </li>
          <li>
            <Link to="/login" className={styles["link"]}>
              Вход
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default AppHeader;
