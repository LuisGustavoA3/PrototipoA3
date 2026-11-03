import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background:
          "oklch(var(--background-channels) / calc(var(--background-alpha, 1) * <alpha-value>))",
        foreground:
          "oklch(var(--foreground-channels) / calc(var(--foreground-alpha, 1) * <alpha-value>))",
        card: "oklch(var(--card-channels) / calc(var(--card-alpha, 1) * <alpha-value>))",
        "card-foreground":
          "oklch(var(--card-foreground-channels) / calc(var(--card-foreground-alpha, 1) * <alpha-value>))",
        popover:
          "oklch(var(--popover-channels) / calc(var(--popover-alpha, 1) * <alpha-value>))",
        "popover-foreground":
          "oklch(var(--popover-foreground-channels) / calc(var(--popover-foreground-alpha, 1) * <alpha-value>))",
        primary:
          "oklch(var(--primary-channels) / calc(var(--primary-alpha, 1) * <alpha-value>))",
        "primary-foreground":
          "oklch(var(--primary-foreground-channels) / calc(var(--primary-foreground-alpha, 1) * <alpha-value>))",
        secondary:
          "oklch(var(--secondary-channels) / calc(var(--secondary-alpha, 1) * <alpha-value>))",
        "secondary-foreground":
          "oklch(var(--secondary-foreground-channels) / calc(var(--secondary-foreground-alpha, 1) * <alpha-value>))",
        muted:
          "oklch(var(--muted-channels) / calc(var(--muted-alpha, 1) * <alpha-value>))",
        "muted-foreground":
          "oklch(var(--muted-foreground-channels) / calc(var(--muted-foreground-alpha, 1) * <alpha-value>))",
        accent:
          "oklch(var(--accent-channels) / calc(var(--accent-alpha, 1) * <alpha-value>))",
        "accent-foreground":
          "oklch(var(--accent-foreground-channels) / calc(var(--accent-foreground-alpha, 1) * <alpha-value>))",
        destructive:
          "oklch(var(--destructive-channels) / calc(var(--destructive-alpha, 1) * <alpha-value>))",
        "destructive-foreground":
          "oklch(var(--destructive-foreground-channels) / calc(var(--destructive-foreground-alpha, 1) * <alpha-value>))",
        border:
          "oklch(var(--border-channels) / calc(var(--border-alpha, 1) * <alpha-value>))",
        input:
          "oklch(var(--input-channels) / calc(var(--input-alpha, 1) * <alpha-value>))",
        ring: "oklch(var(--ring-channels) / calc(var(--ring-alpha, 1) * <alpha-value>))",
        "ring-offset-background":
          "oklch(var(--background-channels) / calc(var(--background-alpha, 1) * <alpha-value>))",
        "chart-1":
          "oklch(var(--chart-1-channels) / calc(var(--chart-1-alpha, 1) * <alpha-value>))",
        "chart-2":
          "oklch(var(--chart-2-channels) / calc(var(--chart-2-alpha, 1) * <alpha-value>))",
        "chart-3":
          "oklch(var(--chart-3-channels) / calc(var(--chart-3-alpha, 1) * <alpha-value>))",
        "chart-4":
          "oklch(var(--chart-4-channels) / calc(var(--chart-4-alpha, 1) * <alpha-value>))",
        "chart-5":
          "oklch(var(--chart-5-channels) / calc(var(--chart-5-alpha, 1) * <alpha-value>))",
        sidebar:
          "oklch(var(--sidebar-channels) / calc(var(--sidebar-alpha, 1) * <alpha-value>))",
        "sidebar-foreground":
          "oklch(var(--sidebar-foreground-channels) / calc(var(--sidebar-foreground-alpha, 1) * <alpha-value>))",
        "sidebar-primary":
          "oklch(var(--sidebar-primary-channels) / calc(var(--sidebar-primary-alpha, 1) * <alpha-value>))",
        "sidebar-primary-foreground":
          "oklch(var(--sidebar-primary-foreground-channels) / calc(var(--sidebar-primary-foreground-alpha, 1) * <alpha-value>))",
        "sidebar-accent":
          "oklch(var(--sidebar-accent-channels) / calc(var(--sidebar-accent-alpha, 1) * <alpha-value>))",
        "sidebar-accent-foreground":
          "oklch(var(--sidebar-accent-foreground-channels) / calc(var(--sidebar-accent-foreground-alpha, 1) * <alpha-value>))",
        "sidebar-border":
          "oklch(var(--sidebar-border-channels) / calc(var(--sidebar-border-alpha, 1) * <alpha-value>))",
        "sidebar-ring":
          "oklch(var(--sidebar-ring-channels) / calc(var(--sidebar-ring-alpha, 1) * <alpha-value>))",
        "primary-soft":
          "oklch(var(--primary-soft-channels) / calc(var(--primary-soft-alpha, 1) * <alpha-value>))",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
