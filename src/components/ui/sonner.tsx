"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "toast !bg-neutral-100 dark:!bg-neutral-900 !text-black dark:!text-neutral-100 !shadow-[3px_3px_0_0_#000000] !border-[2px] !border-black !rounded-md !p-3 !flex !items-center !justify-between !gap-4",
          title: "font-bold text-base m-0",
          description: "text-muted-foreground dark:!text-neutral-300",
          actionButton:
            "!bg-neutral-200 dark:!bg-neutral-200 !border-[2px] !border-solid !border-black !py-[14px] !px-6 !text-lg !text-black hover:!bg-neutral-300 !transition-colors !cursor-pointer",
          cancelButton:
            "text-neutral-600 underline hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
        },
        duration: 5000,
      }}
      {...props}
    />
  );
};

export { Toaster };
