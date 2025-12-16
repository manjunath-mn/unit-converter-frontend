import type { Category, CategoryConfig } from "./types";

export const conversionConfig: Record<Category, CategoryConfig> = {
  length: {
    endpoint: "/length",
    units: [
      { value: "meter", label: "Meter (m)" },
      { value: "kilometer", label: "Kilometer (km)" },
      { value: "mile", label: "Mile (mi)" },
    ],
    defaultFrom: "meter",
    defaultTo: "kilometer",
  },
  weight: {
    endpoint: "/weight",
    units: [
      { value: "gram", label: "Gram (g)" },
      { value: "kilogram", label: "Kilogram (kg)" },
      { value: "pound", label: "Pound (lb)" },
    ],
    defaultFrom: "gram",
    defaultTo: "kilogram",
  },
  temperature: {
    endpoint: "/temperature",
    units: [
      { value: "celsius", label: "Celsius (°C)" },
      { value: "fahrenheit", label: "Fahrenheit (°F)" },
      { value: "kelvin", label: "Kelvin (K)" },
    ],
    defaultFrom: "celsius",
    defaultTo: "fahrenheit",
  },
};
