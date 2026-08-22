import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mb-6">B</div>
      <h1 className="text-4xl font-bold text-ink-900">404</h1>
      <p className="text-ink-500 mt-2">We couldn't find that page.</p>
      <Link href="/dashboard" className="mt-6 inline-flex items-center justify-center rounded-lg bg-violet-600 text-white px-4 py-2 text-sm font-medium hover:bg-violet-700">Back to dashboard</Link>
    </div>
  );
}
