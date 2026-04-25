import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Link,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PdfUploadFieldProps {
  label?: string;
  value?: string; // existing pdfUrl (external URL or base64 data URL)
  onChange: (url: string | undefined) => void;
  id?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GOLD = "#d4af37";
const GOLD_BG = "rgba(212,175,55,0.08)";
const GOLD_BORDER = "rgba(212,175,55,0.3)";
const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function getFileName(url: string): string {
  if (url.startsWith("data:")) return "Uploaded PDF";
  try {
    const parts = new URL(url).pathname.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "PDF");
  } catch {
    return url.length > 60 ? `${url.slice(0, 57)}…` : url;
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PdfUploadField({
  label = "PDF Document",
  value,
  onChange,
  id = "pdf-upload",
}: PdfUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(`File too large. Maximum size is ${MAX_MB} MB.`);
        return;
      }
      setUploading(true);
      try {
        const dataUrl = await readFileAsDataUrl(file);
        onChange(dataUrl);
      } catch {
        setError("Failed to read file. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile],
  );

  const handleRemove = useCallback(() => {
    onChange(undefined);
    setError(null);
    setUrlInput("");
    setUrlMode(false);
  }, [onChange]);

  const handleUrlSubmit = useCallback(() => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError("Please enter a valid URL.");
      return;
    }
    setError(null);
    onChange(trimmed);
    setUrlMode(false);
    setUrlInput("");
  }, [urlInput, onChange]);

  const hasPdf = !!value;
  const fileName = value ? getFileName(value) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {!hasPdf && (
          <button
            type="button"
            onClick={() => {
              setUrlMode((v) => !v);
              setError(null);
            }}
            className="text-xs underline underline-offset-2 transition-colors"
            style={{ color: GOLD }}
          >
            {urlMode ? "Drag & drop instead" : "Paste link instead"}
          </button>
        )}
      </div>

      {/* Already has a PDF → show badge + controls */}
      {hasPdf && (
        <div
          data-ocid="pdf-upload.success_state"
          className="flex items-center gap-3 rounded-lg border px-4 py-3"
          style={{ background: GOLD_BG, borderColor: GOLD_BORDER }}
        >
          <CheckCircle2 size={18} style={{ color: GOLD, flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: GOLD }}>
              {fileName}
            </p>
            <p className="text-xs text-muted-foreground">PDF linked</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
              title="View PDF"
            >
              <ExternalLink size={14} />
            </a>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              data-ocid="pdf-upload.upload_button"
              onClick={() => inputRef.current?.click()}
              className="h-7 w-7"
              title="Replace with file"
            >
              <Upload size={14} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                setUrlMode(true);
                handleRemove();
              }}
              className="h-7 w-7"
              title="Replace with link"
            >
              <Link size={14} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              data-ocid="pdf-upload.delete_button"
              onClick={handleRemove}
              className="h-7 w-7 text-destructive hover:text-destructive"
              title="Remove PDF"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* URL input mode */}
      {!hasPdf && urlMode && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              id={`${id}-url`}
              type="url"
              placeholder="https://drive.google.com/… or Dropbox link"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUrlSubmit();
                }
              }}
              className="flex-1"
              style={{ borderColor: GOLD_BORDER }}
              data-ocid="pdf-upload.url_input"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              style={{ background: GOLD, color: "#1a1200", border: "none" }}
              data-ocid="pdf-upload.url_submit_button"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a Google Drive, Dropbox, or any direct PDF link.
          </p>
        </div>
      )}

      {/* Drop zone — shown when no PDF and not URL mode */}
      {!hasPdf && !urlMode && (
        <button
          type="button"
          data-ocid="pdf-upload.dropzone"
          className="relative w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 cursor-pointer transition-colors duration-200"
          style={{
            borderColor: dragging ? GOLD : GOLD_BORDER,
            background: dragging ? "rgba(212,175,55,0.12)" : GOLD_BG,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          {uploading ? (
            <>
              <Loader2
                size={28}
                className="animate-spin"
                style={{ color: GOLD }}
              />
              <p className="text-sm text-muted-foreground">Uploading…</p>
            </>
          ) : (
            <>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "rgba(212,175,55,0.15)" }}
              >
                <FileText size={22} style={{ color: GOLD }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: GOLD }}>
                  {dragging ? "Drop PDF here" : "Drag & drop PDF"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  or{" "}
                  <span
                    className="underline underline-offset-2"
                    style={{ color: GOLD }}
                  >
                    click to browse
                  </span>{" "}
                  · PDF only · max {MAX_MB} MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {/* Upload loading indicator when replacing */}
      {hasPdf && uploading && (
        <div
          data-ocid="pdf-upload.loading_state"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Loader2 size={14} className="animate-spin" />
          Uploading…
        </div>
      )}

      {/* Error */}
      {error && (
        <p
          data-ocid="pdf-upload.error_state"
          className="text-xs text-destructive flex items-center gap-1.5"
        >
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleInputChange}
        tabIndex={-1}
      />
    </div>
  );
}
