import toast from "react-hot-toast";
import React from "react";
import { ToastConfig } from "../types";
import { NETWORKS } from "../constants";

export class ToastService {
  /**
   * Show a generic toast notification
   */
  static show(config: ToastConfig): void {
    const { title, description, type, hash, chainId } = config;

    const network = NETWORKS.find((n) => n.id === chainId);
    const explorerUrl =
      hash && network ? `${network.explorer}/tx/${hash}` : null;

    // Create toast content as string with optional explorer link
    let toastContent = title;
    if (description) {
      toastContent += `\n${description}`;
    }
    if (explorerUrl) {
      toastContent += `\nView on Explorer: ${explorerUrl}`;
    }

    const toastOptions = {
      duration: type === "error" ? 5000 : 4000,
      position: "top-right" as const,
    };

    switch (type) {
      case "success":
        toast.success(toastContent, toastOptions);
        break;
      case "error":
        toast.error(toastContent, toastOptions);
        break;
      case "loading":
        toast.loading(toastContent, toastOptions);
        break;
      default:
        toast(toastContent, toastOptions);
    }
  }

  /**
   * Show swap estimation toast
   */
  static estimating(): void {
    this.show({
      title: "Estimating Swap",
      description: "Calculating optimal swap route...",
      type: "loading",
    });
  }

  /**
   * Show swap execution toast
   */
  static swapping(): void {
    this.show({
      title: "Executing Swap",
      description: "Processing your swap transaction...",
      type: "loading",
    });
  }

  /**
   * Show transaction confirmation toast
   */
  static confirming(hash: string, chainId?: number): void {
    this.show({
      title: "Transaction Confirming",
      description: "Waiting for blockchain confirmation...",
      type: "loading",
      hash,
      chainId,
    });
  }

  /**
   * Show success toast
   */
  static success(hash: string, chainId?: number): void {
    this.show({
      title: "Swap Successful!",
      description: "Your tokens have been swapped successfully.",
      type: "success",
      hash,
      chainId,
    });
  }

  /**
   * Show error toast
   */
  static error(message: string): void {
    this.show({
      title: "Transaction Failed",
      description: message,
      type: "error",
    });
  }

  /**
   * Show estimation error toast
   */
  static estimationError(message: string): void {
    this.show({
      title: "Estimation Failed",
      description: message,
      type: "error",
    });
  }
}
