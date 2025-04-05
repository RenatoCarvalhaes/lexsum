import React, { useState } from 'react';
import { Search, User, Building2, Phone, Mail, FileText } from 'lucide-react';

interface Registration {
  id: string;
  type: 'PF' | 'PJ';
  name: string;
  document: string;
  email: string;
  phone: string;
  createdAt: string;
}

function RegistrationList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - replace with actual data from your backend
  const mockData: Registration[] = [
    {
      id: '1',
      type: 'PF',
      name: 'João Silva',
      document: '123.456.789-00',
      email: 'joao@email.com',
      phone: '(11) 98765-4321',
      createdAt: '2024-03-15'
    },
    {
      id: '2',
      type: 'PJ',
      name: 'Tech Solutions LTDA',
      document: '12.345.678/0001-90',
      email: 'contato@techsolutions.com',
      phone: '(11) 3456-7890',
      createdAt: '2024-03-14'
    }
  ];

  const [registrations] = useState<Registration[]>(mockData);

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reg.name.toLowerCase().includes(searchLower) ||
      reg.document.toLowerCase().includes(searchLower) ||
      reg.email.toLowerCase().includes(searchLower) ||
      reg.phone.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Cadastros</h1>
          <div className="relative flex-1 md:max-w-2xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, CPF/CNPJ, email, telefone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <FileText className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-500">
              Tente pesquisar usando termos diferentes
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${
                      registration.type === 'PF' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {registration.type === 'PF' ? (
                        <User className="h-6 w-6" />
                      ) : (
                        <Building2 className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {registration.name}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {new Date(registration.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600">
                      {registration.document}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">{registration.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{registration.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {/* TODO: Implement edit action */}}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationList;