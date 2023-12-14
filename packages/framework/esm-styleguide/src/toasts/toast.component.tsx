/** @module @category UI */
import React, { useEffect, useState, useCallback } from "react";
import { ActionableNotification } from "@carbon/react";

const defaultOptions = {
  millis: 5000,
};

export interface ToastProps {
  toast: ToastNotificationMeta;
  closeToast(): void;
}

export interface ToastDescriptor {
  description: React.ReactNode;
  onActionButtonClick?: () => void;
  actionButtonLabel?: string;
  kind?: ToastType;
  critical?: boolean;
  title?: string;
  millis?: number;
}

export interface ToastNotificationMeta extends ToastDescriptor {
  id: number;
}

export type ToastType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';

export const Toast: React.FC<ToastProps> = ({ toast, closeToast }) => {
  const {
    description,
    kind,
    critical,
    title,
    actionButtonLabel,
    onActionButtonClick = () => {},
    millis = actionButtonLabel ? null : defaultOptions.millis,
  } = toast;

  const handleActionClick = useCallback(() => {
    onActionButtonClick();
    closeToast();
  }, [closeToast, onActionButtonClick]);

  useEffect(() => {
    if (millis) {
      const timeoutId = setTimeout(closeToast, millis);
      return () => clearTimeout(timeoutId);
    }
  }, [closeToast, millis]);

  return (
    <ActionableNotification
      actionButtonLabel={actionButtonLabel}
      kind={kind || "info"}
      lowContrast={critical}
      subtitle={description}
      title={title || ""}
      onActionButtonClick={handleActionClick}
      onClose={closeToast}
    />
  );
};
