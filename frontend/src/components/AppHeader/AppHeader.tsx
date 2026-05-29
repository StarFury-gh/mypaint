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
              New Canvas
            </Link>
          </li>
          <li>
            <Link to="/" className={styles["link"]}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default AppHeader;
