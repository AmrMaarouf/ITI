// Amr Abdelfatah Mahmoud Abdelmonem
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictPrice } from "../api/predictionClient";
import { PredictionRequest } from "../types/prediction";
import locations from "../locations.json";

const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
const transactionOptions = ["New Property", "Resale"];
const ownershipOptions = ["Freehold", "Leasehold", "Co-operative Society", "Power Of Attorney"];
const facingOptions = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

export default function PredictionForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PredictionRequest>({
    location: locations[0] ?? "other",
    carpet_area_sqft: 1000,
    floor_num: 1,
    bathroom: 2,
    balcony: 1,
    furnishing: furnishingOptions[0],
    transaction: transactionOptions[0],
    ownership: ownershipOptions[0],
    facing: facingOptions[0],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.location) {
      setError("Please select a location.");
      return;
    }
    if (form.carpet_area_sqft <= 0) {
      setError("Carpet area must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const result = await predictPrice(form);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      setError("Something went wrong while contacting the prediction service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Location
        <select value={form.location} onChange={(e) => updateField("location", e.target.value)}>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </label>

      <label>
        Carpet area (sqft)
        <input
          type="number"
          min={1}
          value={form.carpet_area_sqft}
          onChange={(e) => updateField("carpet_area_sqft", Number(e.target.value))}
        />
      </label>

      <label>
        Floor
        <input
          type="number"
          value={form.floor_num}
          onChange={(e) => updateField("floor_num", Number(e.target.value))}
        />
      </label>

      <label>
        Bathrooms
        <input
          type="number"
          min={0}
          value={form.bathroom}
          onChange={(e) => updateField("bathroom", Number(e.target.value))}
        />
      </label>

      <label>
        Balconies
        <input
          type="number"
          min={0}
          value={form.balcony}
          onChange={(e) => updateField("balcony", Number(e.target.value))}
        />
      </label>

      <label>
        Furnishing
        <select value={form.furnishing} onChange={(e) => updateField("furnishing", e.target.value)}>
          {furnishingOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Transaction
        <select value={form.transaction} onChange={(e) => updateField("transaction", e.target.value)}>
          {transactionOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Ownership
        <select value={form.ownership} onChange={(e) => updateField("ownership", e.target.value)}>
          {ownershipOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Facing
        <select value={form.facing} onChange={(e) => updateField("facing", e.target.value)}>
          {facingOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Predicting..." : "Predict price"}
      </button>
    </form>
  );
}
