import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onClear: () => void;
  isLoading: boolean;
}

export function ImageUpload({ onFileSelect, selectedFile, previewUrl, onClear, isLoading }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        Upload da Imagem
      </h2>

      {!previewUrl ? (
        <div
          className={`drop-zone flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer ${isDragging ? "active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center text-sm">
            <span className="text-primary font-medium">Clique para selecionar</span> ou arraste uma imagem
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">PNG, JPG ou WEBP</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border glow-border animate-slide-up">
          <img src={previewUrl} alt="Preview do veículo" className="w-full h-48 md:h-64 object-cover" />
          {!isLoading && (
            <button
              onClick={onClear}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-3 py-2">
            <p className="text-xs text-muted-foreground truncate">{selectedFile?.name}</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
