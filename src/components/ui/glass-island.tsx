import type { ReactNode } from "react";

import styles from "./glass-island.module.css";

/** The glass pill shell shared by the navbar and footer. */
export const GlassIsland = ({ children }: { children: ReactNode }) => (
  <div className={styles.root}>
    <span className={styles.frost} aria-hidden />
    <div className={styles.fx}>
      <div className={styles.island}>
        <div className={styles.content}>{children}</div>
        <span className={styles.overlay} aria-hidden />
      </div>
    </div>
  </div>
);

/** Style for the sliding highlight behind the hovered/active item. */
export const glassPillClass = styles.pill;
