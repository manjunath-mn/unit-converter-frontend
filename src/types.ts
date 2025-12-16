export type Category = "length" | "weight" | "temperature";

export type UnitOption = {
  value: string; // must match backend expected unit string
  label: string;
};

export type CategoryConfig = {
  endpoint: "/length" | "/weight" | "/temperature";
  units: UnitOption[];
  defaultFrom: string;
  defaultTo: string;
};

export type ApiError = {
  error?: string;
  message?: string;
};
