import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface RightTopic {
  id: string;
  title: string;
  content: string;
}

function InitialForm() {
  const [formData, setFormData] = useState({
    addressTo: '',
    actionType: '',
    authors: '',
    defendants: '',
    facts: '',
    rights: [{ id: Date.now().toString(), title: '', content: '' }] as RightTopic[],
    requests: '',
    causeValue: '',
    placeAndDate: '',
    signature: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Petição Inicial</h1>
      
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

        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
            Dados dos Autores
          </label>
          <textarea
            id="authors"
            name="authors"
            rows={4}
            value={formData.authors}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite os dados de qualificação dos autores como nome, cpf/cnpj, endereço, estado civil, profissão, etc. Se houver mais de um autor, separe os dados por <enter>."
          />
        </div>

        <div>
          <label htmlFor="defendants" className="block text-sm font-medium text-gray-700 mb-2">
            Dados dos Réus
          </label>
          <textarea
            id="defendants"
            name="defendants"
            rows={4}
            value={formData.defendants}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite os dados de qualificação dos réus como nome, cpf/cnpj, endereço, etc. Se houver mais de réu, separe os dados por <enter>."
          />
        </div>

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
            {formData.rights.map((right, index) => (
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Petição
          </button>
        </div>
      </form>
    </div>
  );
}

export default InitialForm;