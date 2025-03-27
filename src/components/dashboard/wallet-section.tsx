import { CreditCard, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";

const pendingBalance = 450.0;
const availableBalance = 1250.75;

export function WalletSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Wallet</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Available Balance"
          value={`$${availableBalance.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
          description="Ready to withdraw"
        />
        <StatsCard
          title="Pending Balance"
          value={`$${pendingBalance.toFixed(2)}`}
          icon={<CreditCard className="h-4 w-4 text-amber-500" />}
          description="Will be released after appointments"
        />
      </div>
    </div>
  );
}
