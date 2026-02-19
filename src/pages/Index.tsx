import { useState } from "react";
import { FileCheck, ChevronDown, ChevronRight } from "lucide-react";
import PdfViewer from "@/components/PdfViewer";
import ClaimSummary from "@/components/ClaimSummary";
import PatientInfo from "@/components/PatientInfo";
import BillsTable from "@/components/BillsTable";
import AuditIssues from "@/components/AuditIssues";
import DocumentSegments from "@/components/DocumentSegments";
import FileUpload from "@/components/FileUpload";

const sections = [
   { id: "summary", label: "Claim Summary" },
   { id: "patient", label: "Patient Info" },
   { id: "bills", label: "Bills & Items" },
   { id: "audit", label: "Audit Issues" },
   { id: "segments", label: "Document Segments" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const Index = () => {
   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
   const [claimsData, setClaimsData] = useState<any>(null);
   const [pdfPage, setPdfPage] = useState(1);
   const [openSections, setOpenSections] = useState<Set<SectionId>>(
      new Set(["summary", "patient", "bills", "audit", "segments"]),
   );

   const toggleSection = (id: SectionId) => {
      setOpenSections((prev) => {
         const next = new Set(prev);
         next.has(id) ? next.delete(id) : next.add(id);
         return next;
      });
   };

   const goToPage = (page: number) => setPdfPage(page);

   const handleFilesReady = (url: string, data: any) => {
      setPdfUrl(url);
      setClaimsData(data);
   };

   if (!pdfUrl || !claimsData) {
      return <FileUpload onFilesReady={handleFilesReady} />;
   }

   const data = claimsData as any;
   const edited = data.edited_data;
   const nmeAnalysis = edited.nme_analysis;
   const patient = edited.patient_summary.patient_details;
   const hospitalization = edited.patient_summary.hospitalization_details;

   return (
      <div className="h-screen flex flex-col">
         {/* Header */}
         <header className="bg-card border-b px-4 py-2.5 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-primary">
               <FileCheck className="h-5 w-5" />
               <h1 className="text-base font-bold tracking-tight">
                  Claims Review
               </h1>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
               #{data.claim_id}
            </span>
            <span className="text-xs text-muted-foreground">
               {data.review_notes}
            </span>
            <button
               onClick={() => {
                  setPdfUrl(null);
                  setClaimsData(null);
               }}
               className="ml-auto text-xs text-primary hover:underline"
            >
               ← Upload New Files
            </button>
         </header>

         {/* Split screen */}
         <div className="flex-1 flex overflow-hidden">
            {/* Left: PDF */}
            <div className="w-1/2 border-r">
               <PdfViewer
                  fileUrl={pdfUrl}
                  currentPage={pdfPage}
                  onPageChange={setPdfPage}
               />
            </div>

            {/* Right: Data */}
            <div className="w-1/2 overflow-y-auto">
               <div className="p-4 space-y-2">
                  {sections.map(({ id, label }) => (
                     <div
                        key={id}
                        className="border rounded-lg overflow-hidden"
                     >
                        <button
                           onClick={() => toggleSection(id)}
                           className="w-full flex items-center justify-between px-4 py-2.5 bg-card hover:bg-muted/30 transition-colors"
                        >
                           <span className="text-sm font-semibold">
                              {label}
                           </span>
                           {openSections.has(id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                           ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                           )}
                        </button>
                        {openSections.has(id) && (
                           <div className="px-4 py-3 border-t bg-card">
                              {id === "summary" && (
                                 <ClaimSummary
                                    data={{
                                       ...data,
                                       audit_analysis: data.audit_analysis,
                                    }}
                                 />
                              )}
                              {id === "patient" && (
                                 <PatientInfo
                                    patient={patient}
                                    hospitalization={hospitalization}
                                 />
                              )}
                              {id === "bills" && (
                                 <BillsTable
                                    bills={nmeAnalysis.bills}
                                    onPageClick={goToPage}
                                 />
                              )}
                              {id === "audit" && (
                                 <AuditIssues audit={data.audit_analysis} />
                              )}
                              {id === "segments" && (
                                 <DocumentSegments
                                    segments={data.segments.aggregated_segments}
                                    onPageClick={goToPage}
                                 />
                              )}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Index;
