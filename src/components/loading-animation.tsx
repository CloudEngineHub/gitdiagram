"use client";

import { trio } from "ldrs";
import { useTheme } from "next-themes";

trio.register();

const LoadingAnimation = () => {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#f5f5f5" : "#171717";

  return <l-trio size="40" speed="2.0" color={color} />;
};

export default LoadingAnimation;
