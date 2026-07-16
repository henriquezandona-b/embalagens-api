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
      return res.status(405).json({
        error: "Metodo nao permitido"
      });
    }

    const data = req.body?.data ?? "";
    const itens = req.body?.itens ?? [];

    console.log("DATA:", data);
    console.log("TOTAL ITENS:", itens.length);

    for (const item of itens) {

      console.log("SALVANDO:", item);

      const { error } = await supabase
        .from("inventario")
        .insert({

          data,

          categoria: item.categoria,

          item: item.item,

          quantidade: item.quantidade

        });

      if (error) {

        console.log(error);

        return res.status(500).json(error);

      }

    }

    return res.status(200).json({

      ok: true,

      message: "Inventário salvo."

    });

  }

  catch (erro) {

    console.log(erro);

    return res.status(500).json({

      error: erro.message

    });

  }

}
