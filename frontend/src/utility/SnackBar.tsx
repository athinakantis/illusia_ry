import React, { useEffect, useState } from "react";
import { Snackbar, Alert, LinearProgress } from "@mui/material";

interface SnackBarProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  duration?: number; // milliseconds
  onClose: () => void;
}

const SnackBar: React.FC<SnackBarProps> = ({
  open,
  message,
  severity = "success",
  duration = 3000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open) return;
    const total = duration;
    const interval = 100;
    let elapsed = 0;
    setProgress(100);
    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.max(0, 100 - (elapsed / total) * 100);
      setProgress(pct);
      if (elapsed >= total) {
        clearInterval(timer);
        onClose();
      }
    }, interval);
    return () => clearInterval(timer);
  }, [open, duration, onClose]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        sx={{ width: 250, fontSize: "1rem", p: 2 }}  // larger width & font
      >
        {message}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mt: 1, height: 6 }}
        />
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
