import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Metodo nao permitido" });
    }

    const data = req.body?.data ?? "";
    const itens = req.body?.itens ?? [];

    console.log("DATA:", data);
    console.log("TOTAL ITENS:", itens.length);

    for (const item of itens) {
      console.log("SALVANDO ITEM:", item);

      const { data: retorno, error } = await supabase
        .from("conferencias")
        .insert({
          data,
          item: item.item,
          contagem: item.contagem,
          nota: item.nota,
          diferenca: item.diferenca,
          finalizado: false
        })
        .select();

      if (error) {
        console.log("❌ ERRO SUPABASE:", error);
        return res.status(500).json(error);
      }

      console.log("✔ SALVO:", retorno);
    }

    return res.status(200).json({
      ok: true,
      message: "Dados salvos com sucesso"
    });

  } catch (error) {
    console.error("ERRO GERAL:", error);

    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
