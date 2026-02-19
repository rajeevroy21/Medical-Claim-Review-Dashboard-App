import { AlertTriangle, FileText, DollarSign, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClaimSummaryProps {
  data: {
    claim_id: string;
    claim_type: string;
    status: string;
    audit_analysis: {
      original_claimed_amount: number;
      original_total_of_bills: number;
      discrepancy_amount: number;
      discrepancy_reason: string;
      status: string;
    };
  };
}

const ClaimSummary = ({ data }: ClaimSummaryProps) => {
  const audit = data.audit_analysis;

  const statusColor = audit.status === "UNDERCLAIMED"
    ? "bg-warning/15 text-warning border-warning/30"
    : "bg-success/15 text-success border-success/30";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon={<FileText className="h-4 w-4" />}
          label="Claim ID"
          value={data.claim_id}
        />
        <InfoCard
          icon={<FileText className="h-4 w-4" />}
          label="Type"
          value={data.claim_type}
          badge={
            <Badge variant="secondary" className="text-xs ml-2">
              {data.status}
            </Badge>
          }
        />
        <InfoCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Claimed Amount"
          value={`$${audit.original_claimed_amount.toLocaleString()}`}
        />
        <InfoCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Bills Total"
          value={`$${audit.original_total_of_bills.toLocaleString()}`}
        />
      </div>

      <div className="rounded-lg border p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Discrepancy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-warning">
              ${audit.discrepancy_amount.toLocaleString()}
            </span>
            <Badge className={`${statusColor} border text-xs`}>
              {audit.status}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {audit.discrepancy_reason}
        </p>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: React.ReactNode;
}) => (
  <div className="rounded-lg border bg-card p-3">
    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <div className="flex items-center">
      <span className="text-sm font-semibold">{value}</span>
      {badge}
    </div>
  </div>
);

export default ClaimSummary;
