export interface PlateResult {
  id: string;
  plate: string;
  confidence: number;
  imageUrl: string;
  timestamp: Date;
}

export interface ApiDetection {
  placa: string;
  confianca: number;
}

export interface ApiResponse {
  status: string;
  mensagem: string;
  dados: ApiDetection[];
}
