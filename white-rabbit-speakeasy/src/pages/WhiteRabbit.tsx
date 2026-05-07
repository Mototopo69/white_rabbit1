import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function WhiteRabbit({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    nome: "", 
    email: "", 
    telefono: "", 
    indovinello: "" 
  });

  const rispostaCorretta = "orologio"; 

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_BREVO_API_KEY;
    const EMAIL_CLIENTE = "sampognaro.matteo@iisgalvanimi.edu.it";

    if (!apiKey) {
      alert("Manca la chiave API! Controlla il file .env e riavvia il server.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. EMAIL PER L'UTENTE (Contiene solo l'indovinello)
      const resUtente = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": apiKey, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { name: "White Rabbit Speakeasy", email: EMAIL_CLIENTE },
          to: [{ email: formData.email, name: formData.nome }],
          subject: "Messaggio dal Coniglio Bianco",
          htmlContent: `
            <div style="font-family: serif; color: #1a1a1a; padding: 20px;">
              <h2>Benvenuto nel club, ${formData.nome}.</h2>
              <p>Per sbloccare la porta segreta, risolvi l'indovinello:</p>
              <p style="font-size: 18px; font-style: italic;">"Cosa ha le lancette ma non le mani?"</p>
              <p>Torna sul sito e scrivi la parola d'ordine.</p>
            </div>
          `
        })
      });

      // 2. EMAIL PER TE (Contiene SOLO i dati per il tuo database)
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
              <br>
              <p style="font-size: 10px; color: #999;">Copia questi dati nel tuo archivio manuale.</p>
            </div>
          `
        })
      });

      if (resUtente.ok && resProprietario.ok) {
        setStep(2); // Passa alla schermata indovinello
      } else {
        alert("Errore nell'invio delle email. Verifica di aver confermato la tua mail su Brevo.");
      }
    } catch (err) {
      alert("Errore di connessione.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRiddleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.indovinello.toLowerCase().trim() === rispostaCorretta) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("🎉 PORTA SBLOCCATA!\n\nAccesso alla newsletter autorizzato.");
      }, 1500);
    } else {
      alert("La parola d'ordine è errata.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8" style={{ fontFamily: "'Playfair Display', serif" }}>
      
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1764874299178-a56feb233295?q=80&w=1080')" }} 
      />
      <div className="absolute inset-0 bg-[#1a0a0a]/90" />

      <button 
        onClick={onBack} 
        className="absolute top-8 left-8 z-20 text-[#d4af37] flex items-center gap-2 hover:gap-3 transition-all font-serif italic"
      >
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

            <Input 
              placeholder="Nome e Cognome" 
              value={formData.nome} 
              onChange={(e:any) => setFormData({...formData, nome: e.target.value})} 
              className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60 placeholder:text-gray-600" 
              required 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={(e:any) => setFormData({...formData, email: e.target.value})} 
              className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60 placeholder:text-gray-600" 
              required 
            />
            <Input 
              type="tel" 
              placeholder="Telefono (Facoltativo)" 
              value={formData.telefono} 
              onChange={(e:any) => setFormData({...formData, telefono: e.target.value})} 
              className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60 placeholder:text-gray-600" 
            />

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#d4af37] hover:bg-[#c19b2b] text-black font-bold h-14 tracking-[0.2em] transition-all duration-500 mt-4 uppercase text-xs"
            >
              {isLoading ? 'INVIO IN CORSO...' : 'RICHIEDI ACCESSO 🐇'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRiddleSubmit} className="space-y-8 animate-in fade-in duration-1000">
            <div className="text-center">
              <h2 className="text-[#d4af37] tracking-[0.2em] uppercase text-xs mb-4">L'Indovinello</h2>
              <p className="text-gray-300 text-sm italic font-serif px-4">
                "Controlla la tua posta. Abbiamo inviato la parola d'ordine."
              </p>
            </div>

            <Input 
              placeholder="La tua risposta..." 
              value={formData.indovinello} 
              onChange={(e:any) => setFormData({...formData, indovinello: e.target.value})} 
              className="bg-transparent border-b border-[#d4af37]/40 border-t-0 border-l-0 border-r-0 rounded-none text-white text-center text-xl h-16 focus:border-[#d4af37] transition-all" 
              required 
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full border border-[#d4af37] bg-transparent hover:bg-[#d4af37] hover:text-black text-[#d4af37] font-bold h-14 tracking-[0.2em] transition-all duration-500 uppercase text-xs"
            >
              {isLoading ? 'VERIFICA...' : 'SBLOCCA PORTA'}
            </Button>
          </form>
        )}

        <p className="text-center text-[#444] text-[9px] tracking-[0.3em] uppercase mt-12 italic">
          © 1923 Antica Bottega · Confidential
        </p>
      </div>
    </div>
  );
}