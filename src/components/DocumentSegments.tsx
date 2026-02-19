import { FileStack, ExternalLink } from "lucide-react";

interface Segment {
  page_ranges: Array<{ start: number; end: number }>;
}

interface DocumentSegmentsProps {
  segments: Record<string, Segment>;
  onPageClick: (page: number) => void;
}

const SEGMENT_LABELS: Record<string, string> = {
  claim_forms: "Claim Forms",
  cheque_or_bank_details: "Bank Details",
  identity_document: "Identity Document",
  discharge_summary: "Discharge Summary",
  prescription: "Prescription",
  investigation_report: "Investigation Report",
  itemized_bill: "Itemized Bill",
  consolidated_bill: "Consolidated Bill",
  other: "Other Documents",
};

const DocumentSegments = ({ segments, onPageClick }: DocumentSegmentsProps) => (
  <div className="space-y-1.5">
    {Object.entries(segments).map(([key, segment]) => (
      <div key={key} className="flex items-center justify-between rounded-md border px-3 py-2 hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-2">
          <FileStack className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{SEGMENT_LABELS[key] || key}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {segment.page_ranges.map((range, i) => {
            const label = range.start === range.end
              ? `${range.start}`
              : `${range.start}–${range.end}`;
            return (
              <button
                key={i}
                onClick={() => onPageClick(range.start)}
                className="inline-flex items-center gap-0.5 text-xs font-mono text-primary hover:underline bg-primary/5 rounded px-1.5 py-0.5"
              >
                {label} <ExternalLink className="h-2.5 w-2.5" />
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export default DocumentSegments;
