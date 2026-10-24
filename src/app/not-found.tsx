import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-mist pt-20">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 className="heading h1 mt-4">Page not found</h1>
        <p className="lead mt-6 max-w-[48ch] text-muted">This page doesn’t exist or has moved. Use the menu, or go back to the home page.</p>
        <Link href="/" className="btn btn-primary mt-10">
          Go to home page
        </Link>
      </div>
    </section>
  );
}
