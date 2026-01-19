export default async function handler(req, res) {
  const netlifyPayload = req.body;

  const status =
    netlifyPayload.state === "ready" ? "success" : "error";

  await fetch(
    "https://webhooks.datocms.com/spArAEoWbB/deploy-results",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );

  res.status(200).json({ ok: true });
}
