import React from 'react';
import { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import InitialForm from './components/InitialForm';
import ContestacaoForm from './components/ContestacaoForm';
import PersonalInfoForm from './components/PersonalInfoForm';
import PessoaFisicaForm from './components/PessoaFisicaForm';
import PessoaJuridicaForm from './components/PessoaJuridicaForm';
import RegistrationList from './components/RegistrationList';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('inicial');

  const handleLogin = (email: string, password: string) => {
    // TODO: Implement actual authentication
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Login onLogin={handleLogin} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-8 overflow-auto">
          {currentPage === 'inicial' && <InitialForm />}
          {currentPage === 'contestacao' && <ContestacaoForm />}
          {currentPage === 'impugnacao' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Impugnação</h1>
              <p className="text-gray-600">
                Área destinada ao gerenciamento de impugnações.
              </p>
            </div>
          )}
          {currentPage === 'cadastros' && <RegistrationList />}
          {currentPage === 'pessoas-fisicas' && <PessoaFisicaForm />}
          {currentPage === 'pessoas-juridicas' && <PessoaJuridicaForm />}
          {currentPage === 'configuracoes' && <PersonalInfoForm />}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;