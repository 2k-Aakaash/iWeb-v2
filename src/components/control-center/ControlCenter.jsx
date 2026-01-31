import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import styles from "./control-center.module.css";
// import ControlCenterBody from "./ControlCenterBody";
import ControlCenterBody from "./ControlCenterBody"

export default function ControlCenter() {
  const { controlCenterOpen, closeControlCenter } = useUIStore();

  return (
    <AnimatePresence>
      {controlCenterOpen && (
        <>
          <div className={styles.overlay} onClick={closeControlCenter} />

          <motion.div
            className={`${styles.panel} glass`}
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ControlCenterBody />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
