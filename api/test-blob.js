export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.vercel.com/v2/blob",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pathname: "teste.txt",
          content: Buffer.from("Funcionou!").toString("base64"),
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      ok: true,
      data,
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      erro: err.message,
    });
  }
}
