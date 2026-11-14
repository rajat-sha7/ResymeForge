import { Inter } from "next/font/google";

/**
 * Site typeface: SF Pro on Apple devices, Inter everywhere else.
 *
 * SF Pro can't be served as a web font under Apple's license, so it's reached through the
 * `-apple-system` / `BlinkMacSystemFont` keywords in the CSS font stack (see globals.css).
 * Inter is the fallback for Windows, Android, and Linux. It's not preloaded, so Apple
 * devices, which never use it, don't download it.
 */
export const fallbackSans = Inter({ subsets: ["latin"], variable: "--font-fallback-sans", display: "swap", preload: false });

export const siteFontVars = fallbackSans.variable;
