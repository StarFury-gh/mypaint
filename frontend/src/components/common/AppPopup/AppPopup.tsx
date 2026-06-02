import React, { type ReactNode, useEffect } from "react";
import styles from "./AppPopup.module.css";

interface AppPopupProps {
  isOpen: boolean;
  onClose: () => void;
  content: ReactNode;
  title?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

function AppPopup(props: AppPopupProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (props.closeOnEsc && event.key === "Escape" && props.isOpen) {
        props.onClose();
      }
    };

    if (props.isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [props.isOpen, props.onClose, props.closeOnEsc, props]);

  if (!props.isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.closeOnOverlayClick && e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        {(props.title || props.showCloseButton) && (
          <div className={styles.header}>
            {props.title && <h2 className={styles.title}>{props.title}</h2>}
            {props.showCloseButton && (
              <button
                onClick={props.onClose}
                className={styles.closeButton}
                aria-label="Close popup"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className={styles.content}>{props.content}</div>
      </div>
    </div>
  );
}

export default AppPopup;
