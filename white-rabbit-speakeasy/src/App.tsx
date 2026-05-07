import React, { useState } from 'react'
import AnticaBottega from './pages/AnticaBottega'
import WhiteRabbit from './pages/WhiteRabbit'

function App() {
  const [page, setPage] = useState<'bottega' | 'rabbit'>('bottega')

  return (
    <main>
      {page === 'bottega' ? (
        <AnticaBottega onNavigate={() => setPage('rabbit')} />
      ) : (
        <WhiteRabbit onBack={() => setPage('bottega')} />
      )}
    </main>
  )
}

export default App
