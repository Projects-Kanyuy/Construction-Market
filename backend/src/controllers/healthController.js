export const health = async (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
};
