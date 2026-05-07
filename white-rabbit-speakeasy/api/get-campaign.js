export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.brevo.com/v3/emailCampaigns?status=sent&limit=1&sort=desc", {
      headers: { "api-key": process.env.BREVO_API_KEY, "accept": "application/json" }
    });
    const data = await response.json();
    if (data.campaigns?.length > 0) res.status(200).json({ url: data.campaigns[0].shareLink });
    else res.status(404).json({ error: "No campaign" });
  } catch { res.status(500).json({ error: "Error" }); }
}
