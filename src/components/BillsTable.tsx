import { FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BillItem {
  "s.no.": number;
  item_name: string;
  category: string;
  final_amount: number;
  is_nme: boolean;
  deduction_reason?: string;
}

interface Bill {
  bill: {
    bill_id: string;
    bill_type: string;
    bill_date: string;
    invoice_number: string;
    net_amount: number;
    total_discount: number;
    facility_details: { name: string };
    page_number: number;
  };
  items: BillItem[];
}

interface BillsTableProps {
  bills: Bill[];
  onPageClick: (page: number) => void;
}

const BillsTable = ({ bills, onPageClick }: BillsTableProps) => (
  <div className="space-y-4">
    {bills.map((billEntry, idx) => {
      const b = billEntry.bill;
      const nmeCount = billEntry.items.filter((i) => i.is_nme).length;
      return (
        <div key={b.bill_id} className="border rounded-lg overflow-hidden">
          {/* Bill header */}
          <div className="bg-secondary/50 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <span className="text-sm font-semibold">{b.invoice_number}</span>
                <span className="text-xs text-muted-foreground ml-2">{b.bill_type.replace("_", " ")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">${b.net_amount.toLocaleString()}</span>
              <button
                onClick={() => onPageClick(b.page_number)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Pg {b.page_number} <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground px-3 py-1.5 border-b flex items-center justify-between">
            <span>{b.facility_details.name} • {b.bill_date}</span>
            {nmeCount > 0 && (
              <Badge className="bg-nme-bg text-nme border-nme/20 text-[10px]">
                {nmeCount} NME item{nmeCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Items table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-3 py-1.5 text-left text-xs font-medium text-muted-foreground w-8">#</th>
                  <th className="px-3 py-1.5 text-left text-xs font-medium text-muted-foreground">Item</th>
                  <th className="px-3 py-1.5 text-left text-xs font-medium text-muted-foreground">Category</th>
                  <th className="px-3 py-1.5 text-right text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-3 py-1.5 text-center text-xs font-medium text-muted-foreground w-14">NME</th>
                </tr>
              </thead>
              <tbody>
                {billEntry.items.map((item) => (
                  <tr
                    key={item["s.no."]}
                    className={`border-b last:border-0 ${item.is_nme ? "bg-nme-bg" : "hover:bg-muted/20"}`}
                  >
                    <td className="px-3 py-1.5 text-xs text-muted-foreground">{item["s.no."]}</td>
                    <td className="px-3 py-1.5">
                      <span className={`text-sm ${item.is_nme ? "text-nme font-medium" : ""}`}>
                        {item.item_name}
                      </span>
                      {item.deduction_reason && (
                        <p className="text-[11px] text-nme/80 mt-0.5">{item.deduction_reason}</p>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-xs text-muted-foreground max-w-[150px] truncate">
                      {item.category}
                    </td>
                    <td className={`px-3 py-1.5 text-right text-sm font-mono ${item.is_nme ? "text-nme font-semibold" : ""}`}>
                      ${item.final_amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      {item.is_nme && (
                        <span className="inline-block w-2 h-2 rounded-full bg-nme" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    })}
  </div>
);

export default BillsTable;
