import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export async function exportarCSV(nomeArquivo: string, linhas: string[][]) {
  const cabecalho = linhas[0].join(";");
  const corpo = linhas.slice(1).map(r => r.map(v => `"${(v||"").replace(/"/g,'""')}"`).join(";"));
  const csv = "\ufeff" + [cabecalho, ...corpo].join("\n");
  const path = FileSystem.cacheDirectory + nomeArquivo;
  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: "text/csv", dialogTitle: "Exportar CSV" });
}
