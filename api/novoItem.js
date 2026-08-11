import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Metodo nao permitido"
    });
  }

  const { item, categoria } = req.body;

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
