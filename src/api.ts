import type { ApiError, Category } from "./types";
import { conversionConfig } from "./conversionConfig";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function buildUrl(path: string, params: Record<string, string>) {
  const url = new URL(path, API_BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

export async function convertUnit(args: {
  category: Category;
  from: string;
  to: string;
  value: number;
}): Promise<number> {
  const { category, from, to, value } = args;

  const endpoint = conversionConfig[category].endpoint;
  const url = buildUrl(endpoint, {
    from,
    to,
    value: String(value),
  });

  const res = await fetch(url);

  // Your controller returns a plain double on success.
  if (res.ok) {
    const text = await res.text();
    const num = Number(text);
    if (Number.isNaN(num)) {
      throw new Error("Invalid response from server");
    }
    return num;
  }

  // If you added GlobalExceptionHandler, it returns JSON
  // Otherwise Spring may return default error payload
  let payload: ApiError | null = null;
  try {
    payload = (await res.json()) as ApiError;
  } catch {
    // ignore json parse
  }

  const message =
    payload?.message ||
    payload?.error ||
    `Request failed (${res.status})`;

  throw new Error(message);
}
