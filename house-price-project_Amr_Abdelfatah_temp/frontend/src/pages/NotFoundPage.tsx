// Amr Abdelfatah Mahmoud Abdelmonem
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main>
      <h1>404 — Page not found</h1>
      <Link to="/">Go home</Link>
    </main>
  );
}
