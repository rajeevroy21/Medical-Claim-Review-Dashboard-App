import { AlertTriangle, ShieldAlert, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditIssuesProps {
  audit: {
    medical_legibility_issues: number;
    policy_violations_count: number;
    policy_remarks: string;
    medical_legibility: {
      prescription_bill_match: boolean;
      diagnosis_treatment_consistent: boolean;
      flagged_items: Array<{
        item_name: string;
        flag_reason: string;
        recommendation: string;
      }>;
      summary: string;
    };
    policy_violations: Array<{
      rule_name: string;
      item_name: string;
      violation_details: string;
      amount_impacted: number;
      recommendation: string;
    }>;
  };
}

const AuditIssues = ({ audit }: AuditIssuesProps) => (
  <div className="space-y-4">
    {/* Counts overview */}
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-center">
        <Stethoscope className="h-5 w-5 text-warning mx-auto mb-1" />
        <p className="text-2xl font-bold text-warning">{audit.medical_legibility_issues}</p>
        <p className="text-xs text-muted-foreground">Legibility Issues</p>
      </div>
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
        <ShieldAlert className="h-5 w-5 text-destructive mx-auto mb-1" />
        <p className="text-2xl font-bold text-destructive">{audit.policy_violations_count}</p>
        <p className="text-xs text-muted-foreground">Policy Violations</p>
      </div>
    </div>

    {/* Medical legibility */}
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-warning/5 px-3 py-2 border-b flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <span className="text-sm font-semibold">Medical Legibility Flags</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex gap-3 text-xs mb-2">
          <span>Prescription Match: <Badge variant={audit.medical_legibility.prescription_bill_match ? "default" : "destructive"} className="text-[10px] ml-1">{audit.medical_legibility.prescription_bill_match ? "Yes" : "No"}</Badge></span>
          <span>Diagnosis Consistent: <Badge className="text-[10px] ml-1 bg-success text-success-foreground">{audit.medical_legibility.diagnosis_treatment_consistent ? "Yes" : "No"}</Badge></span>
        </div>
        <p className="text-xs text-muted-foreground">{audit.medical_legibility.summary}</p>
        <div className="space-y-1.5 mt-2">
          {audit.medical_legibility.flagged_items.map((item, i) => (
            <div key={i} className="rounded bg-warning/5 border border-warning/20 p-2">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium">{item.item_name}</span>
              </div>
              <p className="text-xs text-warning mt-0.5">{item.flag_reason}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">→ {item.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Policy violations */}
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-destructive/5 px-3 py-2 border-b flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-destructive" />
        <span className="text-sm font-semibold">Policy Violations</span>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs text-muted-foreground mb-2">{audit.policy_remarks}</p>
        {audit.policy_violations.map((v, i) => (
          <div key={i} className="rounded bg-destructive/5 border border-destructive/20 p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{v.item_name}</span>
              <span className="text-sm font-mono font-semibold text-destructive">
                ${v.amount_impacted.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-destructive/80 mt-0.5">{v.violation_details}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">→ {v.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AuditIssues;
