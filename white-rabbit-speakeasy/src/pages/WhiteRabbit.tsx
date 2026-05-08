import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function WhiteRabbit({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", telefono: "", indovinello: "" });
  
  // Variabile per salvare i dati presi da Google Fogli
  const [configMese, setConfigMese] = useState({ indovinello: "", parolaSegreta: "", linkSegreto: "" });

  // Appena il sito si apre, va a leggere Google Fogli
  useEffect(() => {
    // IL TUO LINK CORRETTO
    const GOOGLE_SHEET_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRG70Fc5zDDH0aJISH3_QcJoLNJkyarH0mWR7UjIVQ6AHSQ5dESfTOjcpfsY1XA55-VuN3DLPc1OoBH/pub?output=tsv";

    if (GOOGLE_SHEET_LINK.includes("pubhtml")) {
      console.error("ATTENZIONE: Il link deve finire con =tsv");
      return;
    }

    fetch(GOOGLE_SHEET_LINK)
      .then(res => res.text())
      .then(text => {
        // Usa una formula più potente (/\r?\n/) per tagliare gli 'a capo' di qualsiasi sistema
        const righe = text.trim().split(/\r?\n/); 
        
        if (righe.length < 2) {
          console.error("ATTENZIONE: Il foglio sembra vuoto o manca la seconda riga.");
          setConfigMese(prev => ({ ...prev, indovinello: "Errore di lettura dal database." }));
          return;
        }

        const datiMese = righe[1].split('\t'); 
        
        setConfigMese({
          // Se la cella è vuota, ora te lo dice chiaramente
          indovinello: datiMese[0] ? datiMese[0].replace(/"/g, '').trim() : "Indovinello mancante su Google Fogli",
          parolaSegreta: datiMese[1] ? datiMese[1].replace(/"/g, '').trim() : "",
          linkSegreto: datiMese[2] ? datiMese[2].replace(/"/g, '').trim() : ""
        });
      })
      .catch(err => {
        console.error("Errore caricamento database:", err);
        setConfigMese(prev => ({ ...prev, indovinello: "Errore di connessione a Google." }));
      });
  }, []);

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_BREVO_API_KEY;
    const EMAIL_CLIENTE = "sampognaro.matteo@iisgalvanimi.edu.it";

    if (!apiKey) {
      alert("Manca la chiave API! Controlla il file .env.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. EMAIL PER L'UTENTE
      const resUtente = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { name: "White Rabbit Speakeasy", email: EMAIL_CLIENTE },
          to: [{ email: formData.email, name: formData.nome }],
          subject: "Benvenuto da Mr. Rabbit",
          htmlContent: `
            <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: 'Georgia', serif;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #d4af37; padding: 40px; text-align: center;">
                
                <h1 style="color: #d4af37; font-weight: normal; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 10px; font-size: 24px;">Mr. Rabbit</h1>
                <div style="width: 40px; height: 1px; background-color: #d4af37; margin: 0 auto 30px auto;"></div>
                
                <div style="color: #cccccc; font-size: 15px; line-height: 1.8; text-align: left;">
                  <p>È un piacere per me darti il benvenuto,<br>
                  sono <strong style="color: #d4af37;">Mr.Rabbit</strong>, lieto di conoscerti &gt;=</p>
                  
                  <p>Se sei alla ricerca di un'esperienza fuori dall'ordinario, un vero Speakeasy nascosto nel cuore di Milano, sei nel posto giusto. Qui, ogni dettaglio è custodito gelosamente e ogni cocktail è per me un serio impegno da portare a termine come fosse un'opera d’arte.</p>
                  
                  <p>Per varcare la soglia del nostro rifugio segreto, dovrai però dimostrare di possedere la giusta intuizione. Torna alla porta da cui sei arrivato e risolvi l'enigma che ti ho lasciato.</p>
                  
                  <p>Solo chi possiede la chiave corretta potrà conoscere i nostri segreti.</p>
                  
                  <p style="margin-top: 30px;">Ti aspetto dall'altra parte &gt;=</p>
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
                  © 1923 White Rabbit · Confidential
                </div>
                
              </div>
            </div>
          `
        })
      });

      // 2. EMAIL PER TE
      const resProprietario = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { name: "NOTIFICA SISTEMA", email: EMAIL_CLIENTE },
          to: [{ email: EMAIL_CLIENTE }],
          subject: `DATI UTENTE DA ARCHIVIARE: ${formData.nome}`,
          htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
              <h3 style="color: #d4af37;">Nuovo Contatto Registrato</h3>
              <p><b>Nome:</b> ${formData.nome}</p>
              <p><b>Email Utente:</b> ${formData.email}</p>
              <p><b>Telefono:</b> ${formData.telefono || 'Non inserito'}</p>
            </div>
          `
        })
      });

      if (resUtente.ok && resProprietario.ok) {
        setStep(2); 
      } else {
        alert("Errore nell'invio delle email.");
      }
    } catch (err) {
      alert("Errore di connessione.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRiddleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!configMese.parolaSegreta) {
      alert("ERRORE: La parola d'ordine non è stata caricata dal database.");
      return;
    }

    const rispostaUtente = formData.indovinello.toLowerCase().trim();
    const risposteValide = configMese.parolaSegreta.split(',').map(p => p.toLowerCase().trim());

    if (risposteValide.includes(rispostaUtente)) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        window.location.href = configMese.linkSegreto || "https://google.com";
      }, 1000);
    } else {
      alert("La parola d'ordine è errata.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1764874299178-a56feb233295?q=80&w=1080')" }} />
      <div className="absolute inset-0 bg-[#1a0a0a]/90" />

      <button onClick={onBack} className="absolute top-8 left-8 z-20 text-[#d4af37] flex items-center gap-2 hover:gap-3 transition-all font-serif italic">
        ← Torna alla Bottega
      </button>

      <div className="relative z-10 w-full max-w-lg backdrop-blur-2xl rounded-lg p-12 border border-[#d4af37]/20 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-12">
           <h1 className="text-4xl tracking-[0.4em] text-white font-light uppercase">White Rabbit</h1>
           <div className="w-16 h-px bg-[#d4af37]/40 mx-auto mt-4" />
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleRegistrationSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-[#d4af37] tracking-[0.2em] uppercase text-xs mb-2">Registrazione Segreta</h2>
              <p className="text-gray-500 text-[11px] italic font-serif">I tuoi dati rimarranno custoditi nell'archivio privato.</p>
            </div>
            <Input placeholder="Nome e Cognome" value={formData.nome} onChange={(e:any) => setFormData({...formData, nome: e.target.value})} className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60" required />
            <Input type="email" placeholder="Email" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60" required />
            <Input type="tel" placeholder="Telefono (Facoltativo)" value={formData.telefono} onChange={(e:any) => setFormData({...formData, telefono: e.target.value})} className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60" />
            <Button type="submit" disabled={isLoading} className="w-full bg-[#d4af37] hover:bg-[#c19b2b] text-black font-bold h-14 tracking-[0.2em] transition-all uppercase text-xs">
              {isLoading ? 'INVIO IN CORSO...' : 'RICHIEDI ACCESSO'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRiddleSubmit} className="space-y-8 animate-in fade-in duration-1000">
            <div className="text-center">
              <h2 className="text-[#d4af37] tracking-[0.2em] uppercase text-xs mb-4">L'Indovinello</h2>
              <p className="text-gray-300 text-sm italic font-serif px-4">
                {configMese.indovinello}
              </p>
            </div>
            <Input placeholder="La tua risposta..." value={formData.indovinello} onChange={(e:any) => setFormData({...formData, indovinello: e.target.value})} className="bg-transparent border-b border-[#d4af37]/40 border-t-0 border-l-0 border-r-0 rounded-none text-white text-center text-xl h-16 focus:border-[#d4af37] transition-all" required />
            <Button type="submit" disabled={isLoading} className="w-full border border-[#d4af37] bg-transparent hover:bg-[#d4af37] hover:text-black text-[#d4af37] font-bold h-14 tracking-[0.2em] transition-all uppercase text-xs">
              {isLoading ? 'VERIFICA...' : 'SBLOCCA PORTA'}
            </Button>
          </form>
        )}
        <p className="text-center text-[#444] text-[9px] tracking-[0.3em] uppercase mt-12 italic">© 1923 Antica Bottega · Confidential</p>
      </div>
    </div>
  );
}