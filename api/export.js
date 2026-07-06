import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  try {
    // Permitir GET
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Metodo nao permitido" });
    }

    // Buscar dados do Supabase
    const { data, error } = await supabase
      .from("conferencias")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro Supabase:", error);
      return res.status(500).json(error);
    }

    // Criar CSV
    let csv = "ID,Data,Item,Contagem,Nota,Diferenca\n";

    data.forEach((row) => {
      csv += `${row.id},${row.data},${row.item},${row.contagem},${row.nota},${row.diferenca}\n`;
    });

    // Headers para download
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=embalagens.csv"
    );

    return res.status(200).send(csv);

  } catch (err) {
    console.error("Erro geral:", err);
    return res.status(500).json({
      error: err.message,
    });
  }
}
