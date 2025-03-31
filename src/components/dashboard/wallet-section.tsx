import { CreditCard, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { WalletsAdapter, useWalletsQuery } from "@/adapters/WalletsAdapter";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format-currency";

export function WalletSection() {
  const userId = localStorage.getItem("user_id");

  const { data: walletData, isLoading } = useWalletsQuery({
    queryKey: ["wallet", userId!],
    queryCallback: () => WalletsAdapter.getWallet({ params: userId }),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Wallet</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const availableBalance = walletData?.data.available_balance ?? 0;
  const pendingBalance = walletData?.data.pending_balance ?? 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Wallet</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Available Balance"
          value={formatCurrency(availableBalance)}
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
          description="Ready to withdraw"
        />
        <StatsCard
          title="Pending Balance"
          value={formatCurrency(pendingBalance)}
          icon={<CreditCard className="h-4 w-4 text-amber-500" />}
          description="Will be released after appointments"
        />
      </div>
    </div>
  );
}
