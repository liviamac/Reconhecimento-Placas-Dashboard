import { ApiResponse } from "@/types/plate";

const API_BASE_URL = "http://localhost:8000";

export async function recognizePlate(file: File): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/recognize-plate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("Arquivo inválido. Envie uma imagem válida.");
    }
    throw new Error(`Erro do servidor (${response.status}). Tente novamente.`);
  }

  const data: ApiResponse = await response.json();
  return data;
}
