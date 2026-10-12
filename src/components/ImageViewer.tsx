import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImageViewerProps {
  src: string;
  alt: string;
  filename: string;
}

interface ImageDownloadButtonProps {
  src: string;
  filename: string;
}

const getDownloadUrl = (src: string) =>
  src.replace("/upload/", "/upload/fl_attachment/");

export const ImageDownloadButton = ({
  src,
  filename,
}: ImageDownloadButtonProps) => (
  <Button
    asChild
    size="icon"
    variant="ghost"
    aria-label="Download image"
    title="Download image"
  >
    <a href={getDownloadUrl(src)} download={filename}>
      <Download className="size-5 text-green-400" />
    </a>
  </Button>
);

const ImageViewer = ({ src, alt, filename }: ImageViewerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`View image: ${alt}`}
          className="block w-full cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <img
            src={src}
            alt={alt}
            className="max-h-56 w-full rounded-lg bg-black object-contain"
            loading="lazy"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-5xl border-zinc-800 bg-zinc-950 text-white sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <img
          src={src}
          alt={alt}
          className="max-h-[75vh] w-full rounded-lg bg-black object-contain"
        />
        <div className="flex justify-end">
          <Button asChild className="bg-rose-500 text-white hover:bg-rose-600">
            <a href={getDownloadUrl(src)} download={filename}>
              <Download />
              Download image
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
