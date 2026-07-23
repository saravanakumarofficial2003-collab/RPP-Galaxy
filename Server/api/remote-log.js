module.exports = (req, res) => {
  const { ip, tool, user, time } = req.body;

  console.log(
    `[REMOTE ACCESS] ${time} | ${user} | ${tool} → ${ip}`
  );

  res.json({ ok: true });
};
