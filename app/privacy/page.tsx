import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Privacy Policy", description: "How BSDS collects, uses and protects your data." };
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-ink-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold">BSDS</span>
          </Link>
          <Link href="/" className="text-sm text-brand-600 hover:underline">← Back home</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-ink-500 mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <h2 className="text-xl font-semibold mt-8">1. Data we collect</h2>
        <p className="mt-2 text-ink-600">When you create an account we collect your name, email, company name and encrypted password. When you connect a store we store the store name, platform, and product/order data you sync. When you add suppliers we store the supplier name, URL, and source URLs.</p>
        <h2 className="text-xl font-semibold mt-6">2. How we use data</h2>
        <ul className="mt-2 list-disc pl-6 text-ink-600 space-y-1">
          <li>To operate the service, authenticate you and save your work.</li>
          <li>To automate order fulfillment, price updates and stock sync.</li>
          <li>To send notifications about orders, stock and performance.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6">3. Data storage &amp; security</h2>
        <p className="mt-2 text-ink-600">Passwords are hashed with bcrypt. Sessions use secure httpOnly cookies. Data is stored in access-controlled infrastructure.</p>
        <h2 className="text-xl font-semibold mt-6">4. Sharing</h2>
        <p className="mt-2 text-ink-600">We do not sell personal data. We share data only with the sales channels and suppliers you explicitly connect.</p>
        <h2 className="text-xl font-semibold mt-6">5. Your rights</h2>
        <p className="mt-2 text-ink-600">You can access, correct, export or delete your data from Settings, or by emailing privacy@bsd.app.</p>
        <h2 className="text-xl font-semibold mt-6">6. Contact</h2>
        <p className="mt-2 text-ink-600">Questions? Email <a href="mailto:privacy@bsd.app" className="text-brand-600">privacy@bsd.app</a>.</p>
      </main>
    </div>
  );
}
