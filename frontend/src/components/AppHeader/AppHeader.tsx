import { Link } from "react-router-dom";

import styles from "./AppHeader.module.css";

interface NavigationOption {
  title: string;
  name: string;
  to: string;
}

interface AppHeaderProps {
  authStatus: boolean;
}

function AppHeader(props: AppHeaderProps) {
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
    props.authStatus
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

  return (
    <header className={styles["header"]}>
      <nav>
        <ul className={styles["links"]}>
          {navOptions.map((option, idx) => {
            return (
              <li key={idx}>
                <Link to={option.to} className={styles["link"]}>
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
