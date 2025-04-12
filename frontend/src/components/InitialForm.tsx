import React, { useState, useRef } from 'react';
import { Trash2, CheckCircle2, Loader2, UserPlus, AlertCircle, X } from 'lucide-react';
import PartyDetailsForm from './PartyDetailsForm';
import { isValidDocument } from '@/utils/validateDocument';
import type { PartyData } from './PartyDetailsForm';

interface RightTopic {
  id: string;
  title: string;
  content: string;
}

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface PartyTag {
  id: string;
  document: string;
  name: string | null;
  status: 'valid' | 'invalid' | 'loading' | 'pending';
}

function InitialForm() {
  const [formData, setFormData] = useState({
    addressTo: '',
    actionType: '',
    facts: '',
    rights: [{ id: Date.now().toString(), title: '', content: '' }] as RightTopic[],
    requests: '',
    causeValue: '',
    placeAndDate: '',
    signature: ''
  });

  const [authorTags, setAuthorTags] = useState<PartyTag[]>([]);
  const [defendantTags, setDefendantTags] = useState<PartyTag[]>([]);
  const [currentAuthorInput, setCurrentAuthorInput] = useState('');
  const [currentDefendantInput, setCurrentDefendantInput] = useState('');
  const authorInputRef = useRef<HTMLInputElement>(null);
  const defendantInputRef = useRef<HTMLInputElement>(null);

  const [inputError, setInputError] = useState<{ author?: string; defendant?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    {
      id: '1',
      title: 'Validação dos Dados',
      description: 'Verificando todos os campos necessários',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Processamento do Texto',
      description: 'Analisando e formatando o conteúdo',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Criação do Documento',
      description: 'Gerando a petição inicial',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Finalização',
      description: 'Salvando e preparando o documento',
      status: 'pending'
    }
  ]);

  const formatDocument = (doc: string): string => {
    const cleanDoc = doc.replace(/\D/g, '');
    if (cleanDoc.length === 11) {
      return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanDoc.length === 14) {
      return cleanDoc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
  };

  const searchParty = async (document: string): Promise<{ name: string | null; exists: boolean }> => {
    try {
      const response = await fetch(`http://localhost:8000/api/party?document=${encodeURIComponent(document)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'supertoken123'
        }
      });
  
      if (!response.ok) {
        console.error("Erro na resposta da API:", response.status);
        return { name: null, exists: false };
      }
  
      const data = await response.json();
      return {
        name: data.name || null,
        exists: !!data.name
      };
  
    } catch (error) {
      console.error("Erro na requisição:", error);
      return { name: null, exists: false };
    }
  };
    
  const handleAddParty = async (type: 'author' | 'defendant', document: string) => {
    if (!isValidDocument(document)) {
      setInputError(prev => ({
        ...prev,
        [type]: 'Documento inválido. Verifique o CPF ou CNPJ digitado.'
      }));
      return;
    }

    const newTag: PartyTag = {
      id: Date.now().toString(),
      document: formatDocument(document),
      name: null,
      status: 'loading'
    };

    if (type === 'author') {
      setAuthorTags(prev => [...prev, newTag]);
      setCurrentAuthorInput('');
    } else {
      setDefendantTags(prev => [...prev, newTag]);
      setCurrentDefendantInput('');
    }

    setInputError(prev => ({ ...prev, [type]: undefined }));

    try {
      const result = await searchParty(document);
      const updatedTag: PartyTag = {
        ...newTag,
        name: result.name,
        status: result.exists ? 'valid' : 'pending'
      };

      if (type === 'author') {
        setAuthorTags(prev => prev.map(tag => tag.id === newTag.id ? updatedTag : tag));
      } else {
        setDefendantTags(prev => prev.map(tag => tag.id === newTag.id ? updatedTag : tag));
      }
    } catch (error) {
      const errorTag: PartyTag = {
        ...newTag,
        status: 'invalid'
      };

      if (type === 'author') {
        setAuthorTags(prev => prev.map(tag => tag.id === newTag.id ? errorTag : tag));
      } else {
        setDefendantTags(prev => prev.map(tag => tag.id === newTag.id ? errorTag : tag));
      }
    }
  };

  const handleRemoveParty = (type: 'author' | 'defendant', id: string) => {
    if (type === 'author') {
      setAuthorTags(prev => prev.filter(tag => tag.id !== id));
    } else {
      setDefendantTags(prev => prev.filter(tag => tag.id !== id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'author' | 'defendant') => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const input = type === 'author' ? currentAuthorInput : currentDefendantInput;
      if (input.trim()) {
        handleAddParty(type, input.trim());
      }
    }
  };

  const getPendingDocuments = (type: 'author' | 'defendant'): string[] => {
    const tags = type === 'author' ? authorTags : defendantTags;
    return tags
      .filter(tag => tag.status === 'pending')
      .map(tag => tag.document);
  };

  const handleSavePartyDetails = (type: 'author' | 'defendant', data: Record<string, PartyData>) => {
    // Handle saving party details
    console.log(`Saving ${type} details:`, data);
  };

  const renderPartyInput = (
    type: 'author' | 'defendant',
    tags: PartyTag[],
    currentInput: string,
    setCurrentInput: (value: string) => void,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    const label = type === 'author' ? 'Autores' : 'Réus';
    const placeholder = type === 'author' 
      ? 'Digite o CPF/CNPJ do autor e pressione Enter...'
      : 'Digite o CPF/CNPJ do réu e pressione Enter...';

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="min-h-[120px] p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <div
                key={tag.id}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  tag.status === 'valid' ? 'bg-green-100 text-green-800' :
                  tag.status === 'invalid' ? 'bg-red-100 text-red-800' :
                  tag.status === 'loading' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                <span className="max-w-[200px] truncate">{tag.document}</span>
                {tag.status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : tag.status === 'valid' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : tag.status === 'invalid' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                <button
                  onClick={() => handleRemoveParty(type, tag.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, type)}
            className="w-full border-none p-0 focus:ring-0 text-sm"
            placeholder={placeholder}
          />

          {inputError[type] && (
            <p className="mt-1 text-sm text-red-500">
              {inputError[type]}
            </p>
          )}

        </div>
        <p className="text-xs text-gray-500">
          Pressione Enter após digitar cada CPF/CNPJ
        </p>
      </div>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addRightTopic = () => {
    setFormData(prev => ({
      ...prev,
      rights: [...prev.rights, { id: Date.now().toString(), title: '', content: '' }]
    }));
  };

  const updateRightTopic = (id: string, field: 'title' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      rights: prev.rights.map(right => 
        right.id === id ? { ...right, [field]: value } : right
      )
    }));
  };

  const removeRightTopic = (id: string) => {
    if (formData.rights.length > 1) {
      setFormData(prev => ({
        ...prev,
        rights: prev.rights.filter(right => right.id !== id)
      }));
    }
  };

  const updateStepStatus = (stepId: string, status: ProgressStep['status']) => {
    setProgressSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const simulateProgress = async () => {
    try {
      updateStepStatus('1', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStepStatus('1', 'completed');

      updateStepStatus('2', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus('2', 'completed');

      updateStepStatus('3', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2500));
      updateStepStatus('3', 'completed');

      updateStepStatus('4', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStepStatus('4', 'completed');

      setTimeout(() => {
        setIsSubmitting(false);
        setProgressSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
      }, 2000);

    } catch (error) {
      console.error('Error creating petition:', error);
      setProgressSteps(prev => prev.map(step => 
        step.status === 'processing' ? { ...step, status: 'error' } : step
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await simulateProgress();
  };

  const pendingAuthorDocs = getPendingDocuments('author');
  const pendingDefendantDocs = getPendingDocuments('defendant');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Petição Inicial</h1>
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Criando Petição</h2>
            <div className="space-y-6">
              {progressSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {index !== progressSteps.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-full ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                  <div className="flex items-start">
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      {step.status === 'processing' ? (
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                      ) : step.status === 'completed' ? (
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                      ) : step.status === 'error' ? (
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600">!</span>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="addressTo" className="block text-sm font-medium text-gray-700 mb-2">
            Endereçar para
          </label>
          <input
            type="text"
            id="addressTo"
            name="addressTo"
            value={formData.addressTo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o endereçamento da petição..."
          />
        </div>

        <div>
          <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo da Ação
          </label>
          <input
            type="text"
            id="actionType"
            name="actionType"
            value={formData.actionType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o tipo da ação..."
          />
        </div>

        {renderPartyInput(
          'author',
          authorTags,
          currentAuthorInput,
          setCurrentAuthorInput,
          authorInputRef
        )}

        {pendingAuthorDocs.length > 0 && (
          <PartyDetailsForm
            type="author"
            pendingDocuments={pendingAuthorDocs}
            onSave={handleSavePartyDetails}
          />
        )}

        {renderPartyInput(
          'defendant',
          defendantTags,
          currentDefendantInput,
          setCurrentDefendantInput,
          defendantInputRef
        )}

        {pendingDefendantDocs.length > 0 && (
          <PartyDetailsForm
            type="defendant"
            pendingDocuments={pendingDefendantDocs}
            onSave={handleSavePartyDetails}
          />
        )}

        <div>
          <label htmlFor="facts" className="block text-sm font-medium text-gray-700 mb-2">
            Dos Fatos
          </label>
          <textarea
            id="facts"
            name="facts"
            rows={6}
            value={formData.facts}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva os fatos..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Dos Direitos
            </label>
            <button
              type="button"
              onClick={addRightTopic}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
            >
              Adicionar Tópico
            </button>
          </div>
          <div className="space-y-4">
            {formData.rights.map((right, _) => (
              <div key={right.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={right.title}
                    onChange={(e) => updateRightTopic(right.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mr-2"
                    placeholder="Título do tópico..."
                  />
                  <button
                    type="button"
                    onClick={() => removeRightTopic(right.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.rights.length === 1}
                  >
                    <Trash2 className={`h-5 w-5 ${formData.rights.length === 1 ? 'opacity-50' : ''}`} />
                  </button>
                </div>
                <textarea
                  value={right.content}
                  onChange={(e) => updateRightTopic(right.id, 'content', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Conteúdo do argumento..."
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="requests" className="block text-sm font-medium text-gray-700 mb-2">
            Dos Pedidos
          </label>
          <textarea
            id="requests"
            name="requests"
            rows={6}
            value={formData.requests}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva os pedidos..."
          />
        </div>

        <div>
          <label htmlFor="causeValue" className="block text-sm font-medium text-gray-700 mb-2">
            Valor da Causa
          </label>
          <input
            type="text"
            id="causeValue"
            name="causeValue"
            value={formData.causeValue}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o valor da causa..."
          />
        </div>

        <div>
          <label htmlFor="placeAndDate" className="block text-sm font-medium text-gray-700 mb-2">
            Local e Data
          </label>
          <input
            type="text"
            id="placeAndDate"
            name="placeAndDate"
            value={formData.placeAndDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o local e a data..."
          />
        </div>

        <div>
          <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
            Assinatura
          </label>
          <textarea
            id="signature"
            name="signature"
            rows={3}
            value={formData.signature}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite sua assinatura..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Petição
          </button>
        </div>
      </form>
    </div>
  );
}

export default InitialForm;