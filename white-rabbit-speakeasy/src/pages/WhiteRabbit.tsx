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
    // IL TUO LINK GOOGLE FOGLI
    const GOOGLE_SHEET_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRG70Fc5zDDH0aJISH3_QcJoLNJkyarH0mWR7UjIVQ6AHSQ5dESfTOjcpfsY1XA55-VuN3DLPc1OoBH/pub?output=tsv";

    fetch(GOOGLE_SHEET_LINK)
      .then(res => res.text())
      .then(text => {
        const righe = text.trim().split(/\r?\n/); 
        
        if (righe.length < 2) {
          console.error("ATTENZIONE: Il foglio sembra vuoto o manca la seconda riga.");
          setConfigMese(prev => ({ ...prev, indovinello: "Errore di lettura dal database." }));
          return;
        }

        const datiMese = righe[1].split('\t'); 
        
        setConfigMese({
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
    
    // --- DATI IMPOSTATI PER IL TEST ---
    const EMAIL_MITTENTE = "info@whiterabbitmilano.it"; 
    const EMAIL_NOTIFICHE = "sampognaro.matteo@iisgalvanimi.edu.it"; 
    // ----------------------------------

    if (!apiKey) {
      alert("Manca la chiave API! Controlla il file .env.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. EMAIL DI BENVENUTO PER L'UTENTE
      const resUtente = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { name: "White Rabbit Speakeasy 🐰", email: EMAIL_MITTENTE },
          to: [{ email: formData.email, name: formData.nome }],
          subject: "Benvenuto da White Rabbit 🐰",
          htmlContent: `
            <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: 'Georgia', serif;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #d4af37; padding: 40px; text-align: center;">
                <h1 style="color: #d4af37; font-weight: normal; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 10px; font-size: 24px;">White Rabbit</h1>
                <div style="width: 40px; height: 1px; background-color: #d4af37; margin: 0 auto 30px auto;"></div>
                <div style="color: #cccccc; font-size: 15px; line-height: 1.8; text-align: left;">
                  <p>È un piacere per noi darti il benvenuto,<br>
                  siamo il <strong style="color: #d4af37;">White Rabbit</strong>, lieti di conoscerti 🐰</p>
                  <p>Se sei alla ricerca di un'esperienza fuori dall'ordinario, un vero Speakeasy nascosto nel cuore di Milano, sei nel posto giusto. Qui ogni cocktail è un serio impegno da portare a termine come fosse un'opera d’arte.</p>
                  <p>Per varcare la soglia del nostro rifugio segreto, dovrai però dimostrare di possedere la giusta intuizione. Torna alla porta da cui sei arrivato e risolvi l'enigma che ti abbiamo lasciato.</p>
                  <p>Solo chi possiede la chiave corretta potrà conoscere i nostri segreti.</p>
                  <p style="margin-top: 30px;">Ti aspettiamo dall'altra parte 🐰</p>
                </div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
                  © 1925 White Rabbit Milano · Confidential
                </div>
              </div>
            </div>
          `
        })
      });

      // 2. EMAIL DI NOTIFICA PER IL TEST
      const resProprietario = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { name: "SISTEMA WHITE RABBIT 🐰", email: EMAIL_MITTENTE },
          to: [{ email: EMAIL_NOTIFICHE }],
          subject: `NUOVO CONTATTO: ${formData.nome}`,
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
        alert("Errore tecnico nell'invio delle email. Verifica la chiave API e il mittente su Brevo.");
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
      alert("ERRORE: Database non pronto.");
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8 font-serif" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="absolute inset-0 bg-cover bg-center z-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1764874299178-a56feb233295?q=80&w=1080')" }} />

      <button onClick={onBack} className="absolute top-8 left-8 z-20 text-[#d4af37]/60 hover:text-[#d4af37] transition-all text-xs tracking-[0.3em] uppercase">
        ← Torna alla Bottega
      </button>

      <div className="relative z-10 w-full max-w-xl backdrop-blur-3xl rounded-sm p-12 border border-[#d4af37]/10 bg-black/60 shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="text-center mb-16">
           <h1 className="text-5xl tracking-[0.5em] text-white font-extralight uppercase mix-blend-difference">White Rabbit</h1>
           <p className="text-[#d4af37] tracking-[0.4em] uppercase text-[10px] mt-2 opacity-60">MILANO</p>
           <div className="w-12 h-[1px] bg-[#d4af37] mx-auto mt-6 opacity-50" />
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleRegistrationSubmit} className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-[#d4af37] tracking-[0.4em] uppercase text-[10px]">Richiesta di Accesso</h2>
              <p className="text-gray-500 text-[10px] italic font-serif">I tuoi dati per il registro privato del locale.</p>
            </div>
            <div className="space-y-4">
              <Input placeholder="Nome e Cognome" value={formData.nome} onChange={(e:any) => setFormData({...formData, nome: e.target.value})} className="bg-white/5 border-[#d4af37]/20 text-white placeholder:text-gray-700 rounded-none h-12 focus:border-[#d4af37]/50" required />
              <Input type="email" placeholder="Email" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-[#d4af37]/20 text-white placeholder:text-gray-700 rounded-none h-12 focus:border-[#d4af37]/50" required />
              <Input type="tel" placeholder="Telefono" value={formData.telefono} onChange={(e:any) => setFormData({...formData, telefono: e.target.value})} className="bg-white/5 border-[#d4af37]/20 text-white placeholder:text-gray-700 rounded-none h-12 focus:border-[#d4af37]/50" />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-[#d4af37] hover:bg-[#b8952d] text-black font-bold h-14 tracking-[0.3em] uppercase text-[10px] transition-all duration-500">
              {isLoading ? 'Inviando...' : 'Ricevi Invito'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRiddleSubmit} className="space-y-10 animate-in fade-in zoom-in-95 duration-1000 text-center">
            <div className="space-y-6">
              <span className="text-[#d4af37] text-4xl block opacity-30">“</span>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed italic font-light tracking-wide px-4 font-serif">
                {configMese.indovinello.split('//').map((line, index, array) => (
                  <span key={index}>
                    {line.trim()}
                    {index !== array.length - 1 && <><br /><br /></>}
                  </span>
                ))}
              </p>
              <span className="text-[#d4af37] text-4xl block opacity-30">”</span>
            </div>
            
            <Input 
              placeholder="Inserisci la parola d'ordine" 
              value={formData.indovinello} 
              onChange={(e:any) => setFormData({...formData, indovinello: e.target.value})} 
              className="bg-transparent border-b border-[#d4af37]/30 border-t-0 border-l-0 border-r-0 rounded-none text-white text-center text-2xl h-16 focus:border-[#d4af37] focus:ring-0 placeholder:text-gray-800" 
              required 
            />

            <Button type="submit" disabled={isLoading} className="w-full border border-[#d4af37]/50 bg-transparent hover:bg-[#d4af37] hover:text-black text-[#d4af37] font-bold h-14 tracking-[0.4em] uppercase text-[10px] transition-all duration-700">
              {isLoading ? 'Verifica...' : 'Sblocca la Porta'}
            </Button>
            
            <p className="text-gray-600 text-[9px] tracking-widest uppercase">Controlla la tua posta per le istruzioni di White Rabbit</p>
          </form>
        )}

        <div className="mt-16 flex items-center justify-center gap-4 opacity-20">
          <div className="h-[1px] w-8 bg-[#d4af37]" />
          <p className="text-[9px] tracking-[0.5em] text-[#d4af37] uppercase">Est. 1925 Milano</p>
          <div className="h-[1px] w-8 bg-[#d4af37]" />
        </div>
      </div>
    </div>
  );
}
