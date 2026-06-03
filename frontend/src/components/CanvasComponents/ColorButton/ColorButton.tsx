import styles from "./ColorButton.module.css";

interface ColorButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  color: string | null | undefined;
}

function ColorButton(props: ColorButtonProps) {
  return (
    <button
      className={styles["color_btn"]}
      disabled={props.color == null}
      onClick={props.onClick}
      style={
        props.color
          ? { backgroundColor: props.color }
          : { border: "1px solid gray" }
      }
    >
      {props.children}
    </button>
  );
}

export default ColorButton;
