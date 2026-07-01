export default function handler(req, res) {

  return res.status(200).json({
    ok: true,
    env: process.env.RESEND_API_KEY ? "EXISTE" : "NÃO EXISTE"
  });

}
