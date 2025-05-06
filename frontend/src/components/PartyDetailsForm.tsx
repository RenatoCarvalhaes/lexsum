import React, { useState } from 'react';
import { Wand2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;


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
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

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

    // Clear error when field is filled
    if (value.trim()) {
      setErrors(prev => ({
        ...prev,
        [document]: {
          ...prev[document],
          [field]: ''
        }
      }));
    }
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
      // 1) envia o texto livre para o backend
      const res = await fetch(`${API_URL}/api/parse-party-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: freeformText[document] })
      });
  
      if (!res.ok) {
        console.error("Erro ao chamar o parse:", await res.text());
        return;
      }
  
      // lê o XML retornado
      let xmlText = await res.text();
  
      // limpeza de code fences e trim de espaços/brqs de linha
      xmlText = xmlText
        .replace(/^```(?:xml)?\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
  
      console.log("[XML RECEBIDO]", xmlText);
  
      // 2) faz o parsing do XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  
      // 3) checa se houve erro no parsing
      const parserErrors = xmlDoc.getElementsByTagName("parsererror");
      if (parserErrors.length) {
        console.error("ParserError no XML:", parserErrors[0].textContent);
        return;
      }
  
      // helper para extrair cada tag
      const getTag = (tag: string) =>
        xmlDoc.getElementsByTagName(tag)[0]?.textContent?.trim() || "";
  
      // 4) monta o objeto PartyData
      const parsedData: PartyData = {
        name: getTag("name"),
        nationality: getTag("nationality"),
        maritalStatus: getTag("maritalStatus"),
        profession: getTag("profession"),
        rg: getTag("rg"),
        orgaoExpedidor: getTag("orgaoExpedidor"),
        dataExpedicao: getTag("dataExpedicao"),
        email: getTag("email"),
        phone: getTag("phone"),
        address: {
          street: getTag("street"),
          number: getTag("number"),
          complement: getTag("complement"),
          neighborhood: getTag("neighborhood"),
          city: getTag("city"),
          state: getTag("state"),
          cep: getTag("cep"),
        }
      };
  
      console.log("[PARSED DATA]", parsedData);
  
      // 5) atualiza o estado
      setFormData(prev => ({
        ...prev,
        [document]: parsedData
      }));
  
    } catch (err) {
      console.error("Falha no processamento:", err);
    } finally {
      setIsProcessing(prev => ({ ...prev, [document]: false }));
    }
  };
   
  const validateForm = (document: string) => {
    const newErrors: Record<string, string> = {};
    
    if (!formData[document]?.name?.trim()) {
      newErrors.name = 'Nome Completo é obrigatório';
    }

    setErrors(prev => ({
      ...prev,
      [document]: newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    pendingDocuments.forEach(document => {
      if (!validateForm(document)) {
        isValid = false;
      }
    });

    if (isValid) {
      onSave(type, formData);
    }
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
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData[document]?.name || ''}
                      onChange={(e) => handleChange(document, 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        errors[document]?.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors[document]?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors[document].name}</p>
                    )}
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