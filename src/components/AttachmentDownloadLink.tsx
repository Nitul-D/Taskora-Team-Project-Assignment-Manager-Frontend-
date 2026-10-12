import { useState } from "react";
import { Download, FileText, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

interface AttachmentDownloadLinkProps {
  url: string;
  name: string;
}

const AttachmentDownloadLink = ({ url, name }: AttachmentDownloadLinkProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Document download failed (${response.status})`);
      }

      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error("Unable to download attachment:", error);
      toast.error("Unable to download this document. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleDownload()}
      disabled={isDownloading}
      className="inline-flex max-w-full items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-sky-400 hover:text-sky-300 disabled:cursor-wait disabled:opacity-60"
      aria-label={`Download ${name}`}
      title={`Download ${name}`}
    >
      <FileText className="size-4 shrink-0 text-sky-400" />
      <span className="max-w-56 truncate">{name}</span>
      {isDownloading ? (
        <LoaderCircle className="size-4 shrink-0 animate-spin" />
      ) : (
        <Download className="size-4 shrink-0" />
      )}
    </button>
  );
};

export default AttachmentDownloadLink;
