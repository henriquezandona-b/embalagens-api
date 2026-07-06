import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  try {
    // 🔥 CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Metodo nao permitido" });
    }

    const { data, error } = await supabase
      .from("conferencias")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json(error);
    }

    let csv = "ID,Data,Item,Contagem,Nota,Diferenca\n";

    data.forEach((row) => {
      csv += `${row.id},${row.data},${row.item},${row.contagem},${row.nota},${row.diferenca}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=embalagens.csv"
    );

    return res.status(200).send(csv);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
