import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BarChart3 } from "lucide-react";

interface ConfidenceChartProps {
  data: { name: string; confidence: number; plate: string }[];
  average: number;
}

export function ConfidenceChart({ data, average }: ConfidenceChartProps) {
  if (data.length === 0) {
    return (
      <div className="metric-card text-center py-8">
        <BarChart3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">Métricas disponíveis após a primeira leitura</p>
      </div>
    );
  }

  const avgPercent = Math.round(average * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Métricas
        </h2>
        <span className="text-sm font-display text-accent">Média: {avgPercent}%</span>
      </div>

      <div className="metric-card">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 18% 18%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 22% 10%)",
                border: "1px solid hsl(220 18% 18%)",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}%`, "Confiança"]}
              labelFormatter={(label) => {
                const item = data.find((d) => d.name === label);
                return item ? `Placa: ${item.plate}` : label;
              }}
            />
            <ReferenceLine y={avgPercent} stroke="hsl(170 80% 45%)" strokeDasharray="5 5" label="" />
            <Bar dataKey="confidence" fill="hsl(210 100% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
