import { supabase } from "../lib/supabase.js";
import * as XLSX from "xlsx";

export default async function handler(req, res) {

    try {

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        if (req.method !== "GET") {
            return res.status(405).json({
                error: "Método não permitido"
            });
        }

        const { data, error } = await supabase
            .from("conferencias")
            .select("*")
            .order("id", { ascending: true });

        if (error) {

            return res.status(500).json(error);

        }

        const planilha = data.map(item => ({

            ID: item.id,

            Data: item.data,

            Item: item.item,

            Contagem: item.contagem,

            Nota: item.nota,

            Diferença: item.diferenca

        }));

        const wb = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(planilha);

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Embalagens"
        );

        const buffer = XLSX.write(
            wb,
            {
                type: "buffer",
                bookType: "xlsx"
            }
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Embalagens.xlsx"
        );

        return res.status(200).send(buffer);

    }

    catch (erro) {

        return res.status(500).json({
            error: erro.message
        });

    }

}
