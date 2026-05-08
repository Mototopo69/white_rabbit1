import { useState } from "react";

export default function AnticaBottega({ onNavigate }: { onNavigate: () => void }) {
  const [isHovering, setIsHovering] = useState(false);
  const [rabbitHover, setRabbitHover] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white selection:bg-[#d4af37]/30" style={{ fontFamily: "'Playfair Display', serif" }}>
      
      {/* 1. HEADER FISSO */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#d4af37]/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="text-2xl tracking-[0.2em] text-[#d4af37] font-light">
            ANTICA BOTTEGA
          </div>
          <div className="text-[10px] tracking-[0.3em] text-[#666] uppercase font-serif">
            Via Garigliano, 47 · Milano
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (SPLIT SCREEN) */}
      <section className="relative h-screen flex flex-col md:flex-row pt-20">
        <div className="absolute inset-0 flex flex-col md:flex-row">
          {/* Parte Sinistra - Armadio */}
          <div 
            className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src="https://images.unsplash.com/photo-1565348395196-6472cb6c052b?q=80&w=1200"
              className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              alt="Vintage Wardrobe"
            />
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
              style={{ background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.3) 0%, transparent 75%)' }} />
          </div>

          {/* Parte Destra - Affettatrice */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1635093366438-b3292dbadff3?q=80&w=1200"
              className="w-full h-full object-cover"
              alt="Vintage Slicer"
            />
          </div>
        </div>

        {/* Overlay scuro per leggibilità */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        {/* Branding Centrale */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl tracking-[0.1em] text-[#d4af37] mb-4 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              ANTICA BOTTEGA
            </h1>
            <h2 className="text-2xl md:text-3xl tracking-[0.4em] text-[#c9c9c9] font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              DI VIA GARIGLIANO
            </h2>
          </div>

          {/* Linea Decorativa */}
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent opacity-60 mb-12" />

          {/* Coniglio Bianco Segreto */}
          <div className="relative pointer-events-auto">
            <button
              onClick={onNavigate}
              onMouseEnter={() => setRabbitHover(true)}
              onMouseLeave={() => setRabbitHover(false)}
              className="relative p-10 transition-all duration-500 hover:scale-110 group"
            >
              <div className="absolute inset-0 -m-8 rounded-full border border-[#d4af37]/30 animate-ping" />
              <div className={`absolute inset-0 -m-4 rounded-full border transition-colors duration-700 ${rabbitHover ? 'border-white/50' : 'border-[#d4af37]/20'}`} />
              
              <svg width="70" height="70" viewBox="0 0 100 100" className="relative z-10">
                <ellipse cx="50" cy="60" rx="18" ry="23" fill={rabbitHover ? "white" : "#d4af37"} className="transition-colors duration-500" />
                <ellipse cx="42" cy="32" rx="5" ry="18" fill={rabbitHover ? "white" : "#d4af37"} className="transition-colors duration-500" />
                <ellipse cx="58" cy="32" rx="5" ry="18" fill={rabbitHover ? "white" : "#d4af37"} className="transition-colors duration-500" />
                <circle cx="45" cy="57" r="1.5" fill="#1a1a1a" />
                <circle cx="55" cy="57" r="1.5" fill="#1a1a1a" />
              </svg>

              {rabbitHover && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-[12px] tracking-[0.2em] font-serif animate-pulse italic">
                  Segui il coniglio bianco...
                </div>
              )}
            </button>
          </div>
          
          <p className="absolute bottom-10 text-[#444] text-[10px] tracking-[0.5em] uppercase">Antichità & Curiosità dal 1923</p>
        </div>
      </section>

      {/* 3. SEZIONE PEZZI SELEZIONATI (CON IMMAGINI AGGIUNTE) */}
      <section className="py-32 px-8 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl text-center mb-24 tracking-[0.2em] text-[#d4af37] font-light uppercase">
            Pezzi Selezionati
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                name: "Macchina da Scrivere", 
                year: "1920", 
                price: "€ 1.200", 
                image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800" 
              },
              { 
                name: "Orologio da Tasca", 
                year: "1895", 
                price: "€ 3.800", 
                image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800" 
              },
              { 
                name: "Grammofono", 
                year: "1910", 
                price: "€ 2.400", 
                image: "https://images.unsplash.com/photo-1548625361-9f9fa982a55d?q=80&w=800" 
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="mb-10 relative aspect-[4/5] bg-[#1a1a1a] border border-[#d4af37]/10 overflow-hidden transition-all duration-700 group-hover:border-[#d4af37]/50">
                  {/* Immagine con effetto bianco/nero che si colora al passaggio del mouse */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale opacity-70 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-xl mb-2 text-[#c9c9c9] font-serif">{item.name}</h4>
                <p className="text-xs text-[#555] italic mb-4 font-serif">{item.year}</p>
                <p className="text-[#d4af37] tracking-widest text-sm">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INFO SECTION (A TRE COLONNE) */}
      <section className="py-24 px-8 bg-[#1a1a1a] border-t border-[#d4af37]/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
          <div>
            <h5 className="text-[#d4af37] tracking-[0.2em] text-sm mb-8 uppercase font-light">Orari</h5>
            <div className="text-[#888] text-sm font-serif space-y-2 leading-relaxed">
              <p>Mar - Ven: 10:00 - 19:00</p>
              <p>Sabato: 10:00 - 18:00</p>
              <p className="italic">Dom - Lun: Chiuso</p>
            </div>
          </div>

          <div>
            <h5 className="text-[#d4af37] tracking-[0.2em] text-sm mb-8 uppercase font-light">Contatti</h5>
            <div className="text-[#888] text-sm font-serif space-y-2 leading-relaxed">
              <p>+39 02 1923 4567</p>
              <p>info@anticabottega.it</p>
            </div>
          </div>

          <div>
            <h5 className="text-[#d4af37] tracking-[0.2em] text-sm mb-8 uppercase font-light">Indirizzo</h5>
            <div className="text-[#888] text-sm font-serif space-y-2 leading-relaxed">
              <p>Via Garigliano, 47</p>
              <p>20100 Milano</p>
              <p>Italia</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 bg-[#0a0a0a] border-t border-white/5 text-center">
        <p className="text-[10px] italic text-[#444] tracking-[0.3em] mb-4">...non tutte le porte sono visibili...</p>
        <p className="text-[9px] text-[#333] tracking-widest">© 1923 Antica Bottega di Via Garigliano</p>
      </footer>
    </div>
  );
}