import { useState, useCallback } from "react";
import { ScanLine, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { ResultPanel } from "@/components/dashboard/ResultPanel";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { ConfidenceChart } from "@/components/dashboard/ConfidenceChart";
import { usePlateHistory } from "@/hooks/usePlateHistory";
import { recognizePlate } from "@/services/plateApi";
import { PlateResult, ApiDetection } from "@/types/plate";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<PlateResult | null>(null);
  const [allDetections, setAllDetections] = useState<ApiDetection[]>([]);

  const { history, addResult, clearHistory, averageConfidence, confidenceData } = usePlateHistory();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setLastResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    setLastResult(null);
  }, [previewUrl]);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile || !previewUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await recognizePlate(selectedFile);
      setAllDetections(response.dados);

      const commonWords = ["fiat", "ford", "chevrolet", "volkswagen", "honda", "toyota", "hyundai", "renault", "jeep", "nissan", "kia", "peugeot", "citroen", "bmw", "audi", "mercedes", "brasil", "brazil", "uno", "gol", "onix", "hb20", "creta", "compass", "renegade", "tracker", "pulse", "fastback", "argo", "mobi", "cronos", "toro", "strada", "saveiro"];
      const isLikelyPlate = (text: string) => {
        const clean = text.replace(/[\s\-]/g, "");
        if (commonWords.includes(clean.toLowerCase())) return false;
        if (/^[A-Z]{3}[\-]?\d[A-Z0-9]\d{2}$/i.test(clean)) return true;
        if (/^[A-Z0-9]{7}$/i.test(clean) && /[A-Z]/i.test(clean) && /\d/.test(clean)) return true;
        return false;
      };
      const plateDetection = response.dados.find((d) => isLikelyPlate(d.placa));
      const best = plateDetection || response.dados.reduce((a, b) => a.confianca > b.confianca ? a : b);

      const result = addResult({
        plate: best.placa,
        confidence: best.confianca / 100,
        imageUrl: previewUrl,
      });
      setLastResult(result);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Não foi possível conectar à API. Verifique se o servidor está rodando em localhost:8000.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, previewUrl, addResult]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center glow-border">
            <ScanLine className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">PlateVision</h1>
            <p className="text-xs text-muted-foreground">Reconhecimento Inteligente de Placas</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Row: Upload + Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              onClear={handleClear}
              isLoading={isLoading}
            />
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className="w-full gap-2"
              size="lg"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Processando..." : "Reconhecer Placa"}
            </Button>
          </div>

          <ResultPanel result={lastResult} isLoading={isLoading} error={error} detections={allDetections} />
        </div>

        {/* Bottom Row: Chart + History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConfidenceChart data={confidenceData} average={averageConfidence} />
          <HistoryTable history={history} onClear={clearHistory} />
        </div>
      </main>
    </div>
  );
};

export default Index;
