"use client";
import { PageHeader } from "@/components/dashboard/page-header";
import { PriceCalculator } from "@/components/calculator/price-calculator";
import { Calculator } from "lucide-react";

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Price Calculator"
        description="Enter your supplier cost — get the exact price to charge for real profit, including ads, fees and shipping."
        icon={<Calculator className="h-5 w-5" />}
      />
      <PriceCalculator />
    </div>
  );
}
