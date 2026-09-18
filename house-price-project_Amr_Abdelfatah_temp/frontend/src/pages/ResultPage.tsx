// Amr Abdelfatah Mahmoud Abdelmonem
import { Link, useLocation } from "react-router-dom";

function formatPrice(value: number): string {
  if (value >= 1e7) {
    return `₹ ${(value / 1e7).toFixed(2)} Cr`;
  }
  return `₹ ${(value / 1e5).toFixed(2)} Lac`;
}

export default function ResultPage() {
  const location = useLocation();
  const predictedPrice = (location.state as { predictedPrice?: number } | null)?.predictedPrice;

  if (predictedPrice === undefined) {
    return (
      <main>
        <p>No prediction available.</p>
        <Link to="/">Go back</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Predicted price</h1>
      <p>{formatPrice(predictedPrice)}</p>
      <Link to="/">Predict another property</Link>
    </main>
  );
}
