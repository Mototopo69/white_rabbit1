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

  // La risposta corretta all'indovinello
  const rispostaCorretta = "orologio"; 

  // STEP 1: Gestione Registrazione + Invio Mail Automatiche
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Chiamata all'API di registrazione che abbiamo creato prima
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: formData.nome, 
          email: formData.email, 
          telefono: formData.telefono 
        }),
      });

      if (res.ok) {
        // Se le mail sono partite correttamente, passiamo all'indovinello
        setStep(2);
      } else {
        alert("Si è verificato un errore nella registrazione. Riprova tra poco.");
      }
    } catch (err) {
      alert("Errore di connessione con il server.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verifica Indovinello + Reindirizzamento Mail del Mese
  const handleRiddleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.indovinello.toLowerCase().trim() === rispostaCorretta) {
      setIsLoading(true);
      try {
        // Recupera l'ultimo link della campagna da Brevo
        const res = await fetch('/api/get-campaign');
        const data = await res.json();
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Nessun varco attivo al momento. Riprova più tardi.");
          setIsLoading(false);
        }
      } catch (err) {
        alert("Errore nel sistema di sblocco.");
        setIsLoading(false);
      }
    } else {
      alert("La parola d'ordine è errata. Controlla la mail di conferma.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8" style={{ fontFamily: "'Playfair Display', serif" }}>
      
      {/* Sfondo Damascato Scuro */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1764874299178-a56feb233295?q=80&w=1080')" }} 
      />
      <div className="absolute inset-0 bg-[#1a0a0a]/90" />

      {/* Tasto Torna Indietro */}
      <button 
        onClick={onBack} 
        className="absolute top-8 left-8 z-20 text-[#d4af37] flex items-center gap-2 hover:gap-3 transition-all font-serif italic"
      >
        ← Torna alla Bottega
      </button>

      <div className="relative z-10 w-full max-w-lg backdrop-blur-2xl rounded-lg p-12 border border-[#d4af37]/20 bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-12">
           <h1 className="text-4xl tracking-[0.4em] text-white font-light">WHITE RABBIT</h1>
           <div className="w-16 h-px bg-[#d4af37]/40 mx-auto mt-4" />
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleRegistrationSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-[#d4af37] tracking-[0.2em] uppercase text-xs mb-2">Registrazione Segreta</h2>
              <p className="text-gray-500 text-[11px] italic font-serif">I tuoi dati rimarranno custoditi nel nostro archivio privato.</p>
            </div>

            <Input 
              placeholder="Nome e Cognome" 
              value={formData.nome} 
              onChange={(e:any) => setFormData({...formData, nome: e.target.value})} 
              className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60 transition-colors" 
              required 
            />
            <Input 
              type="email" 
              placeholder="Indirizzo Email" 
              value={formData.email} 
              onChange={(e:any) => setFormData({...formData, email: e.target.value})} 
              className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60 transition-colors" 
              required 
            />
            <Input 
              type="tel" 
              placeholder="Telefono (Opzionale)" 
              value={formData.telefono} 
              onChange={(e:any) => setFormData({...formData, telefono: e.target.value})} 
              className="bg-black/40 border-[#d4af37]/20 text-white h-12 focus:border-[#d4af37]/60 transition-colors" 
            />

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#d4af37] hover:bg-[#c19b2b] text-black font-bold h-14 tracking-[0.2em] transition-all duration-500 mt-4 uppercase text-xs"
            >
              {isLoading ? 'INVIO IN CORSO...' : 'RICHIEDI ACCESSO'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRiddleSubmit} className="space-y-8 animate-in fade-in duration-1000">
            <div className="text-center">
              <h2 className="text-[#d4af37] tracking-[0.2em] uppercase text-xs mb-4">L'Indovinello del Coniglio</h2>
              <p className="text-gray-300 text-sm italic font-serif leading-relaxed px-4">
                "Controlla la tua posta. Abbiamo inviato la parola d'ordine al tuo indirizzo."
              </p>
            </div>

            <div className="relative">
              <Input 
                placeholder="Inserisci la risposta..." 
                value={formData.indovinello} 
                onChange={(e:any) => setFormData({...formData, indovinello: e.target.value})} 
                className="bg-transparent border-b border-[#d4af37]/40 border-t-0 border-l-0 border-r-0 rounded-none text-white text-center text-xl h-16 focus:border-[#d4af37] transition-all placeholder:text-gray-700" 
                required 
              />
            </div>

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