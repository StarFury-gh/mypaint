import type { ReactNode } from "react";

import styles from "./ToolButton.module.css";

type DrawingTools =
  | "brush"
  | "eraser"
  | "eyedropper"
  | "fill"
  | "clearCanvas"
  | "saveAs"
  | "uploadToCloud"
  | "square"
  | "circle"
  | "ellipse"
  | "text";

interface ToolButtonProps {
  children: ReactNode;
  onClick: () => void;
  icon?: string;
  currentTool?: string;
  toolName?: DrawingTools;
  disabled?: boolean;
}

function ToolButton(props: ToolButtonProps) {
  const isUndefined =
    props.currentTool === undefined || props.toolName === undefined;

  return (
    <button
      disabled={props.disabled}
      className={`${styles["tool_btn"]} ${!isUndefined && props.currentTool === props.toolName ? styles["active"] : ""}`}
      onClick={props.onClick}
    >
      <div className={styles["btn_content"]}>
        <p>{props.children}</p>
        <img className={styles["btn_icon"]} src={props.icon} alt="" />
      </div>
    </button>
  );
}

export default ToolButton;
