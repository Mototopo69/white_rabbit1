export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { nome, email, telefono } = req.body;

  try {
    // 1. Invio Mail all'UTENTE (con l'indovinello)
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "White Rabbit", email: "info@anticabottega.it" }, // Cambia con la mail verificata del cliente
        to: [{ email: email, name: nome }],
        subject: "Benvenuto nel White Rabbit - L'Indovinello",
        htmlContent: `<h1>Ciao ${nome},</h1><p>Hai richiesto l'accesso al White Rabbit.</p><p>Per entrare, devi risolvere questo indovinello: <b>Cosa ha le lancette ma non le mani?</b></p><p>Inserisci la risposta sul sito per sbloccare la porta.</p>`
      })
    });

    // 2. Invio Mail al PROPRIETARIO (con i dati dell'utente)
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Sistema Sito", email: "info@anticabottega.it" },
        to: [{ email: "info@anticabottega.it" }], // La mail del tuo cliente
        subject: "Nuovo Contatto White Rabbit",
        htmlContent: `<h3>Nuovo utente registrato:</h3><ul><li><b>Nome:</b> ${nome}</li><li><b>Email:</b> ${email}</li><li><b>Telefono:</b> ${telefono || 'Non fornito'}</li></ul>`
      })
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Errore invio mail" });
  }
}
