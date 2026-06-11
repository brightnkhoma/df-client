import { toast } from "sonner";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ShowToastOptions {
  title?: string;
  description: string;
  duration?: number;
}

export const showToast = (
  type: ToastType,
  { title, description, duration = 4000 }: ShowToastOptions
) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  };

  const bgColors = {
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  };

  const textColors = {
    success: "text-emerald-800 dark:text-emerald-300",
    error: "text-red-800 dark:text-red-300",
    info: "text-blue-800 dark:text-blue-300",
    warning: "text-amber-800 dark:text-amber-300",
  };

  return toast.custom(
    (t: any) => (
      <div
        className={`
          flex items-start gap-3 p-4 rounded-xl border shadow-lg
          ${bgColors[type]} ${textColors[type]} font-medium
          animate-in slide-in-from-top-2 duration-300
        `}
      >
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          {title && <div className="font-bold text-sm">{title}</div>}
          <div className={title ? "text-sm mt-1" : "text-sm"}>{description}</div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    {
      duration,
      position: "top-right",
    }
  );
};