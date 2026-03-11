import { PlateResult, ApiDetection } from "@/types/plate";
import { ShieldCheck, AlertTriangle, BadgeCheck } from "lucide-react";

interface ResultPanelProps {
  result: PlateResult | null;
  isLoading: boolean;
  error: string | null;
  detections?: ApiDetection[];
}

const COMMON_WORDS = ["fiat", "ford", "chevrolet", "volkswagen", "honda", "toyota", "hyundai", "renault", "jeep", "nissan", "kia", "peugeot", "citroen", "mitsubishi", "bmw", "audi", "mercedes", "brasil", "brazil", "uno", "gol", "onix", "hb20", "creta", "compass", "renegade", "tracker", "pulse", "fastback", "argo", "mobi", "cronos", "toro", "strada", "saveiro"];

function isPlate(text: string) {
  const clean = text.replace(/[\s\-]/g, "");
  if (COMMON_WORDS.includes(clean.toLowerCase())) return false;
  // Placa brasileira antiga (ABC1234) ou Mercosul (ABC1D23) - aceita confusão OCR
  const strictRegex = /^[A-Z]{3}[\-]?\d[A-Z0-9]\d{2}$/i;
  if (strictRegex.test(clean)) return true;
  // Padrão flexível: 7 caracteres alfanuméricos com pelo menos 1 letra e 1 número
  const flexRegex = /^[A-Z0-9]{7}$/i;
  if (flexRegex.test(clean) && /[A-Z]/i.test(clean) && /\d/.test(clean)) return true;
  return false;
}

function classifyDetection(text: string): string {
  if (isPlate(text)) return "Placa";
  return "Texto";
}

export function ResultPanel({ result, isLoading, error, detections = [] }: ResultPanelProps) {
  if (isLoading) {
    return (
      <div className="metric-card flex flex-col items-center justify-center py-10 animate-pulse-glow">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground text-sm">Processando imagem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metric-card border-destructive/50 flex items-start gap-3 animate-slide-up">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-destructive">Erro na leitura</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="metric-card flex flex-col items-center justify-center py-10 text-center">
        <ShieldCheck className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground text-sm">Envie uma imagem para reconhecer a placa</p>
      </div>
    );
  }

  const confidencePercent = Math.round(result.confidence * 100);
  const confidenceColor =
    confidencePercent >= 80 ? "text-accent" : confidencePercent >= 50 ? "text-yellow-400" : "text-destructive";

  return (
    <div className="metric-card space-y-4 animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <BadgeCheck className="h-4 w-4 text-accent" />
        Placa Identificada
      </h3>

      <div className="text-center py-4">
        <p className="plate-text text-3xl md:text-4xl font-bold text-primary tracking-widest">
          {result.plate}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confiança</span>
          <span className={`font-display font-bold ${confidenceColor}`}>{confidencePercent}%</span>
        </div>
        <div className="confidence-bar">
          <div className="confidence-bar-fill" style={{ width: `${confidencePercent}%` }} />
        </div>
      </div>

      {detections.length > 1 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <h4 className="text-xs font-medium text-muted-foreground">Todas as detecções</h4>
          {detections.map((d, i) => {
            const pct = Math.round(d.confianca);
            const color = pct >= 80 ? "text-accent" : pct >= 50 ? "text-yellow-400" : "text-destructive";
            const type = classifyDetection(d.placa);
            const isMainPlate = isPlate(d.placa);
            return (
              <div key={i} className={`flex items-center justify-between text-sm ${isMainPlate ? "bg-primary/10 rounded px-2 py-1" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isMainPlate ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {type}
                  </span>
                  <span className={`plate-text font-semibold ${isMainPlate ? "text-primary" : "text-muted-foreground"}`}>{d.placa}</span>
                </div>
                <span className={`font-display font-bold ${color}`}>{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
