import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const blob = await put(
      "teste.txt",
      "Funcionou!",
      {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true
      }
    );

    return res.status(200).json({
      ok: true,
      url: blob.url,
      pathname: blob.pathname
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err.message
    });
  }
}
