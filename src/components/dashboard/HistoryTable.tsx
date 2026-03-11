import { PlateResult } from "@/types/plate";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryTableProps {
  history: PlateResult[];
  onClear: () => void;
}

export function HistoryTable({ history, onClear }: HistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="metric-card text-center py-8">
        <History className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">Nenhuma leitura realizada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Histórico ({history.length})
        </h2>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Placa</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Confiança</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium hidden sm:table-cell">Horário</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => {
              const pct = Math.round(item.confidence * 100);
              return (
                <tr key={item.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-2.5 plate-text text-primary font-bold text-sm">{item.plate}</td>
                  <td className="px-4 py-2.5 font-display">{pct}%</td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">
                    {item.timestamp.toLocaleTimeString("pt-BR")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
