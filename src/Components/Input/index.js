import React from "react";
import styles from "./style.module.css";

function Index(props) {
  return (
    <div className={styles.chatInputContainer}>
      <textarea
        placeholder={props.placeholder || "Your Message...."}
        className={styles.chatInput}
      />
    </div>
  );
}

export default Index;
