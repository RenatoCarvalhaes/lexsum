import React, { useState } from 'react';
import { Wand2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface PartyDetailsFormProps {
  type: 'author' | 'defendant';
  pendingDocuments: string[];
  onSave: (type: 'author' | 'defendant', data: Record<string, PartyData>) => void;
}

export interface PartyData {
  name: string;
  nationality: string;
  maritalStatus: string;
  profession: string;
  rg?: string;
  orgaoExpedidor?: string;
  dataExpedicao?: string;
  email?: string;
  phone?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
}

function PartyDetailsForm({ type, pendingDocuments, onSave }: PartyDetailsFormProps) {
  const [formData, setFormData] = useState<Record<string, PartyData>>({});
  const [freeformText, setFreeformText] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const maritalStatusOptions = [
    'Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'Separado(a) Judicialmente'
  ];

  const stateOptions = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleChange = (document: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [document]: {
        ...prev[document],
        [field]: value
      }
    }));
  };

  const handleAddressChange = (document: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [document]: {
        ...prev[document],
        address: {
          ...(prev[document]?.address || {}),
          [field]: value
        }
      }
    }));
  };

  const toggleSection = (document: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [document]: !prev[document]
    }));
  };

  const processFreeformText = async (document: string) => {
    setIsProcessing(prev => ({ ...prev, [document]: true }));
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example parsed data (in production, this would come from the AI service)
      const parsedData = {
        name: 'João da Silva',
        nationality: 'Brasileiro',
        maritalStatus: 'Casado(a)',
        profession: 'Advogado',
        rg: '12.345.678-9',
        orgaoExpedidor: 'SSP/SP',
        address: {
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 45',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          cep: '01234-567'
        }
      };

      setFormData(prev => ({
        ...prev,
        [document]: parsedData
      }));
    } finally {
      setIsProcessing(prev => ({ ...prev, [document]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(type, formData);
  };

  if (pendingDocuments.length === 0) return null;

  const title = type === 'author' ? 'Autor' : 'Réu';

  return (
    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Dados Complementares - {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Por favor, preencha os dados para {pendingDocuments.length === 1 
            ? `o documento ${pendingDocuments[0]}`
            : `os documentos ${pendingDocuments.join(' e ')}`
          }
        </p>
      </div>

      <div className="space-y-8">
        {pendingDocuments.map(document => (
          <div key={document} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700">
                Documento: {document}
              </h4>
              <button
                type="button"
                onClick={() => toggleSection(document)}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedSections[document] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={freeformText[document] || ''}
                  onChange={(e) => setFreeformText(prev => ({
                    ...prev,
                    [document]: e.target.value
                  }))}
                  placeholder={`Digite os dados do ${type === 'author' ? 'autor' : 'réu'} em texto livre (ex: João da Silva, brasileiro, casado, advogado...)`}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => processFreeformText(document)}
                  disabled={isProcessing[document] || !freeformText[document]}
                  className="absolute right-2 top-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {isProcessing[document] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Processar Texto
                </button>
              </div>

              {expandedSections[document] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={formData[document]?.name || ''}
                      onChange={(e) => handleChange(document, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nacionalidade
                    </label>
                    <input
                      type="text"
                      value={formData[document]?.nationality || ''}
                      onChange={(e) => handleChange(document, 'nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado Civil
                    </label>
                    <select
                      value={formData[document]?.maritalStatus || ''}
                      onChange={(e) => handleChange(document, 'maritalStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecione...</option>
                      {maritalStatusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profissão
                    </label>
                    <input
                      type="text"
                      value={formData[document]?.profession || ''}
                      onChange={(e) => handleChange(document, 'profession', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RG
                    </label>
                    <input
                      type="text"
                      value={formData[document]?.rg || ''}
                      onChange={(e) => handleChange(document, 'rg', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Órgão Expedidor
                    </label>
                    <input
                      type="text"
                      value={formData[document]?.orgaoExpedidor || ''}
                      onChange={(e) => handleChange(document, 'orgaoExpedidor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Endereço</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logradouro
                        </label>
                        <input
                          type="text"
                          value={formData[document]?.address?.street || ''}
                          onChange={(e) => handleAddressChange(document, 'street', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número
                        </label>
                        <input
                          type="text"
                          value={formData[document]?.address?.number || ''}
                          onChange={(e) => handleAddressChange(document, 'number', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={formData[document]?.address?.complement || ''}
                          onChange={(e) => handleAddressChange(document, 'complement', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={formData[document]?.address?.neighborhood || ''}
                          onChange={(e) => handleAddressChange(document, 'neighborhood', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData[document]?.address?.cep || ''}
                          onChange={(e) => handleAddressChange(document, 'cep', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData[document]?.address?.city || ''}
                          onChange={(e) => handleAddressChange(document, 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          value={formData[document]?.address?.state || ''}
                          onChange={(e) => handleAddressChange(document, 'state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {stateOptions.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Dados
          </button>
        </div>
      </div>
    </div>
  );
}

export default PartyDetailsForm;