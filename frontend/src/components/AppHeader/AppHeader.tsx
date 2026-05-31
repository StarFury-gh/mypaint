import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks";

import styles from "./AppHeader.module.css";

interface NavigationOption {
  title: string;
  name: string;
  to: string;
}

function AppHeader() {
  const auth = useAuth();

  const [currentPage, setCurrentPage] = useState("main");

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
    auth.status
      ? {
          title: "Профиль",
          name: "profile",
          to: "/profile",
        }
      : {
          title: "Вход",
          name: "login",
          to: "/login",
        },
  ];

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
