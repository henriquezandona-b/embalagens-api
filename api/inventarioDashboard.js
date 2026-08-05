import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Metodo nao permitido"
    });
  }

  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .order("categoria")
    .order("item");

  if (error) {
    return res.status(500).json(error);
  }

  return res.status(200).json({
    itens: data
  });

}
