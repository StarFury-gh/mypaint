import styles from "./AppButton.module.css";

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}

function AppButton(props: AppButtonProps) {
  return (
    <button onClick={props.onClick} className={styles["btn"]}>
      <div className={styles["btn-content"]}>
        <p className={styles["btn-text"]}>{props.children}</p>
        {props.icon ? props.icon : null}
      </div>
    </button>
  );
}

export default AppButton;
