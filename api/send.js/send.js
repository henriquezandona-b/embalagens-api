module.exports = async (req, res) => {
  try {
    res.status(200).json({
      ok: true,
      message: "API funcionando no Vercel"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
