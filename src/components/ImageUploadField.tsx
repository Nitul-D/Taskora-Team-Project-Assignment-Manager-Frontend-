import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadFieldProps {
  value: string | null;
  onChange: (imageData: string | null) => void;
  label: string;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ImageUploadField = ({ value, onChange, label }: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Choose a JPEG, PNG, or WebP image");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Image must be smaller than 5 MB");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      } else {
        toast.error("Unable to read the selected image");
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      toast.error("Unable to read the selected image");
      if (inputRef.current) inputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        {label} <span className="text-zinc-500">(optional)</span>
      </label>
      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label={`Upload an optional ${label.toLowerCase()}`}
        onChange={handleFileChange}
        className="h-auto cursor-pointer border-zinc-700 bg-zinc-950 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1 file:text-white"
      />
      <p className="text-xs text-zinc-500">JPEG, PNG, or WebP - maximum 5 MB</p>
      {value && (
        <div className="relative w-fit">
          <img
            src={value}
            alt={`Selected ${label.toLowerCase()} preview`}
            className="max-h-40 max-w-full rounded-lg border border-zinc-700 object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            aria-label="Remove selected image"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
