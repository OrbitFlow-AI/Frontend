// Tiny classnames helper so components can compose conditional Tailwind classes.
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
