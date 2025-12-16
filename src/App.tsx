import { useEffect, useMemo, useState } from "react";
import type { Category } from "./types";
import { conversionConfig } from "./conversionConfig";
import { convertUnit } from "./api";

export default function App() {
  const [category, setCategory] = useState<Category>("length");
  const config = useMemo(() => conversionConfig[category], [category]);

  const [from, setFrom] = useState(config.defaultFrom);
  const [to, setTo] = useState(config.defaultTo);
  const [value, setValue] = useState<string>("1");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // reset units when category changes
  useEffect(() => {
    setFrom(config.defaultFrom);
    setTo(config.defaultTo);
    setResult(null);
    setError("");
    setValue("1");
  }, [config.defaultFrom, config.defaultTo, category]);

  const canConvert = () => {
    const num = Number(value);
    return value.trim() !== "" && !Number.isNaN(num) && Number.isFinite(num) && from && to;
  };

  async function onConvert() {
    setError("");
    setResult(null);

    const num = Number(value);
    if (!Number.isFinite(num)) {
      setError("Please enter a valid number.");
      return;
    }
    if (from === to) {
      setResult(num);
      return;
    }

    try {
      const r = await convertUnit({ category, from, to, value: num });
      // show up to 6 decimals but avoid ugly trailing zeros in UI
      setResult(Number(r.toFixed(6)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function swap() {
    setFrom(to);
    setTo(from);
    setResult(null);
    setError("");
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginBottom: 6 }}>UniConvert</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>
        Simple Unit Converter (Length, Weight, Temperature) – React + Spring Boot
      </p>

      <div style={{ display: "grid", gap: 12, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        {/* Category */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="temperature">Temperature</option>
          </select>
        </label>

        {/* From/To */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>From</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {config.units.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </label>

          <button type="button" onClick={swap} style={{ height: 40 }}>
            ⇄
          </button>

          <label style={{ display: "grid", gap: 6 }}>
            <span>To</span>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {config.units.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Value */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Value</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
            inputMode="decimal"
          />
        </label>

        {/* Convert */}
        <button
          type="button"
          onClick={onConvert}
          disabled={!canConvert()}
          style={{ height: 44 }}
        >
          Convert
        </button>

        {/* Result / Error */}
        {result !== null && (
          <div style={{ padding: 12, borderRadius: 10, border: "1px solid #cfc" }}>
            <div style={{ fontSize: 14, opacity: 0.8 }}>Result</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{result}</div>
          </div>
        )}

        {error && (
          <div style={{ padding: 12, borderRadius: 10, border: "1px solid #fbb" }}>
            <div style={{ fontSize: 14, opacity: 0.8 }}>Error</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{error}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, opacity: 0.75, fontSize: 14 }}>
        Backend URL: <code>{import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}</code>
      </div>
    </div>
  );
}
