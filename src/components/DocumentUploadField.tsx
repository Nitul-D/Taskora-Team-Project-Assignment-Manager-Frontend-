import { useEffect, useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface UploadedDocument {
  data: string;
  name: string;
}

interface DocumentUploadFieldProps {
  value: UploadedDocument | null;
  onChange: (document: UploadedDocument | null) => void;
}

const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
]);

const DocumentUploadField = ({ value, onChange }: DocumentUploadFieldProps) => {
  const [isReading, setIsReading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
      toast.error("Choose a PDF, DOCX, XLSX, PPTX, TXT, or CSV file");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      toast.error("Document must be 10 MB or smaller");
      event.target.value = "";
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange({ data: reader.result, name: file.name });
      } else {
        toast.error("Unable to read the selected document");
        if (inputRef.current) inputRef.current.value = "";
      }
      setIsReading(false);
    };
    reader.onerror = () => {
      toast.error("Unable to read the selected document");
      setIsReading(false);
      if (inputRef.current) inputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        Document <span className="text-zinc-500">(optional)</span>
      </label>
      <Input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
        aria-label="Upload an optional document"
        onChange={handleFileChange}
        disabled={isReading}
        className="h-auto cursor-pointer border-zinc-700 bg-zinc-950 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1 file:text-white"
      />
      <p className="text-xs text-zinc-500">
        PDF, DOCX, XLSX, PPTX, TXT, or CSV - maximum 10 MB
      </p>
      {value && (
        <div className="flex items-center gap-2 rounded-md border border-zinc-700 p-2 text-sm text-zinc-300">
          <FileText className="size-4 shrink-0 text-sky-400" />
          <span className="min-w-0 flex-1 truncate">{value.name}</span>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            aria-label="Remove selected document"
            onClick={() => onChange(null)}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadField;
