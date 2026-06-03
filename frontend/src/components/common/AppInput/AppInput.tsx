import type { ChangeEvent } from "react";

import styles from "./AppInput.module.css";

interface AppInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hasError?: boolean;
  defaultValue?: string;
}

function AppInput(props: AppInputProps) {
  return (
    <div className={styles["container"]}>
      <label className={styles["label"]} htmlFor="">
        {props.label}
      </label>
      <input
        defaultValue={props.defaultValue}
        value={props.value}
        className={`${styles["input"]} ${props.hasError ? styles["error"] : ""}`}
        type="text"
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e)}
      />
    </div>
  );
}

export default AppInput;
