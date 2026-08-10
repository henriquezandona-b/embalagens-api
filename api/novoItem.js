import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Metodo nao permitido"
    });
  }

  const {
    item,
    categoria
  } = req.body;

  if (!item || !categoria) {
    return res.status(400).json({
      error: "Dados obrigatorios nao informados"
    });
  }

  const { data, error } = await supabase
    .from("inventario")
    .insert([
      {
        item,
        categoria,
        quantidade: 0
      }
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json({
    sucesso: true,
    data
  });

}
