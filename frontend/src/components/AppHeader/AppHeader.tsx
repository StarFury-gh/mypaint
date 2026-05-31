import { Link } from "react-router-dom";
import styles from "./AppHeader.module.css";
import { useState } from "react";

interface NavigationOption {
  title: string;
  name: string;
  to: string;
}

const navOptions: Array<NavigationOption> = [
  {
    title: "MyPaint",
    name: "main",
    to: "/",
  },
  {
    title: "Новый холст",
    name: "newCanvas",
    to: "/draw",
  },
  {
    title: "Вход",
    name: "login",
    to: "/login",
  },
];

function AppHeader() {
  const [currentPage, setCurrentPage] = useState("main");

  const handlePageChange = (newPage: string) => {
    setCurrentPage(newPage);
  };

  return (
    <header className={styles["header"]}>
      <nav>
        <ul className={styles["links"]}>
          {navOptions.map((option, idx) => {
            return (
              <li key={idx}>
                <Link
                  onClick={() => handlePageChange(option.name)}
                  to={option.to}
                  className={`${styles["link"]} ${currentPage === option.name ? styles["active"] : ""}`}
                >
                  {option.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default AppHeader;
