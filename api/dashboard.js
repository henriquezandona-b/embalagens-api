import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {

    const { data, error } = await supabase
      .from("conferencias")
      .select("*");

    if (error) {
      return res.status(500).json(error);
    }

    const totalItens = data.length;

    const totalDias = new Set(
      data.map(x => x.data)
    ).size;

    const divergencias = data.filter(
      x => Number(x.diferenca) !== 0
    );

    const totalDivergencias = divergencias.length;

    const porcentagemAcerto =
      totalItens === 0
        ? 0
        : (
            ((totalItens - totalDivergencias) /
            totalItens) * 100
          ).toFixed(2);

    const ranking = {};

    divergencias.forEach(item => {

      if (!ranking[item.item]) {
        ranking[item.item] = 0;
      }

      ranking[item.item]++;

    });

    const topItens = Object.entries(ranking)
      .map(([item, total]) => ({
        item,
        total
      }))
      .sort((a,b)=>b.total-a.total)
      .slice(0,5);

    return res.status(200).json({

      totalDias,

      totalItens,

      totalDivergencias,

      porcentagemAcerto,

      topItens

    });

  }

  catch(err){

    return res.status(500).json({

      error:err.message

    });

  }

}
