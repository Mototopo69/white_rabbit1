export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { nome, email, telefono } = req.body;

  // LA TUA EMAIL PER I TEST
  const TUA_EMAIL_TEST = "sampognaro.matteo@iisgalvanimi.edu.it"; 

  try {
    // 1. Mail all'UTENTE (quello che si registra nel form)
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "White Rabbit Test", email: TUA_EMAIL_TEST }, 
        to: [{ email: email, name: nome }],
        subject: "Benvenuto nel White Rabbit - Risolvi l'Indovinello",
        htmlContent: `<h3>Ciao ${nome},</h3><p>Per entrare nel club segreto, rispondi: <b>Cosa ha le lancette ma non le mani?</b></p>`
      })
    });

    // 2. Mail a TE (che fai finta di essere il cliente)
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Sistema White Rabbit", email: TUA_EMAIL_TEST },
        to: [{ email: TUA_EMAIL_TEST }], 
        subject: "Nuovo Contatto Ricevuto!",
        htmlContent: `<h3>Nuovo contatto:</h3><ul><li>Nome: ${nome}</li><li>Email: ${email}</li><li>Tel: ${telefono || 'N/A'}</li></ul>`
      })
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Errore invio" });
  }
}
