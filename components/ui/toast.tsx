"use client";

import { ToastService } from "@/lib/services/toastService";

// Re-export the toast service methods for backward compatibility
export const swapToasts = {
  estimating: () => ToastService.estimating(),
  swapping: () => ToastService.swapping(),
  confirming: (hash: string, chainId: number) =>
    ToastService.confirming(hash, chainId),
  success: (hash: string, chainId: number) =>
    ToastService.success(hash, chainId),
  error: (error: string) => ToastService.error(error),
  estimationError: (error: string) => ToastService.estimationError(error),
};
