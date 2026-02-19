import { useState, useCallback, useRef } from "react";
import { Upload, FileText, FileJson, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFilesReady: (pdfUrl: string, jsonData: any) => void;
}

const FileUpload = ({ onFilesReady }: FileUploadProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const url = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfUrl(url);
    } else if (file.type === "application/json" || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setJsonData(data);
          setJsonFile(file);
        } catch {
          setError("Invalid JSON file. Please check the format.");
        }
      };
      reader.readAsText(file);
    } else {
      setError("Please upload a PDF or JSON file.");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      Array.from(e.dataTransfer.files).forEach(handleFile);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleFile);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfFile(null);
    setPdfUrl(null);
  };

  const removeJson = () => {
    setJsonData(null);
    setJsonFile(null);
  };

  const canProceed = pdfUrl && jsonData;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <FileText className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight">Claims Review</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload a claim PDF and its extracted JSON data to begin review.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drop files here or <span className="text-primary underline">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Accepts PDF and JSON files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.json,application/pdf,application/json"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* File status */}
        <div className="space-y-2">
          <FileStatus
            label="PDF Document"
            icon={<FileText className="h-4 w-4" />}
            file={pdfFile}
            onRemove={removePdf}
          />
          <FileStatus
            label="JSON Data"
            icon={<FileJson className="h-4 w-4" />}
            file={jsonFile}
            onRemove={removeJson}
          />
        </div>

        {/* Start button */}
        <Button
          className="w-full"
          size="lg"
          disabled={!canProceed}
          onClick={() => canProceed && onFilesReady(pdfUrl!, jsonData)}
        >
          Start Review
        </Button>
      </div>
    </div>
  );
};

const FileStatus = ({
  label,
  icon,
  file,
  onRemove,
}: {
  label: string;
  icon: React.ReactNode;
  file: File | null;
  onRemove: () => void;
}) => (
  <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
    <div className="flex items-center gap-3">
      <div className={file ? "text-primary" : "text-muted-foreground"}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          {file ? file.name : "Not uploaded"}
        </p>
      </div>
    </div>
    {file ? (
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-success" />
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4" />
        </button>
      </div>
    ) : (
      <span className="text-xs text-muted-foreground">Waiting…</span>
    )}
  </div>
);

export default FileUpload;
