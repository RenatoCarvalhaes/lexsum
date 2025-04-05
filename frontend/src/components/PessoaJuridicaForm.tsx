import React, { useState } from 'react';

interface PessoaJuridicaFormData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  email: string;
  celular: string;
  telefone: string;
  cpfResponsavel: string;
  nomeResponsavel: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

function PessoaJuridicaForm() {
  const [formData, setFormData] = useState<PessoaJuridicaFormData>({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    email: '',
    celular: '',
    telefone: '',
    cpfResponsavel: '',
    nomeResponsavel: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Pessoa Jurídica</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ*
            </label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              required
              value={formData.cnpj}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-2">
              Razão Social*
            </label>
            <input
              type="text"
              id="razaoSocial"
              name="razaoSocial"
              required
              value={formData.razaoSocial}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Fantasia*
            </label>
            <input
              type="text"
              id="nomeFantasia"
              name="nomeFantasia"
              required
              value={formData.nomeFantasia}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-gray-700 mb-2">
              Inscrição Estadual
            </label>
            <input
              type="text"
              id="inscricaoEstadual"
              name="inscricaoEstadual"
              value={formData.inscricaoEstadual}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="inscricaoMunicipal" className="block text-sm font-medium text-gray-700 mb-2">
              Inscrição Municipal
            </label>
            <input
              type="text"
              id="inscricaoMunicipal"
              name="inscricaoMunicipal"
              value={formData.inscricaoMunicipal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-2">
              Celular*
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              required
              value={formData.celular}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="cpfResponsavel" className="block text-sm font-medium text-gray-700 mb-2">
              CPF do Responsável
            </label>
            <input
              type="text"
              id="cpfResponsavel"
              name="cpfResponsavel"
              value={formData.cpfResponsavel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Responsável
            </label>
            <input
              type="text"
              id="nomeResponsavel"
              name="nomeResponsavel"
              value={formData.nomeResponsavel}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
              CEP
            </label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 mb-2">
              Logradouro
            </label>
            <input
              type="text"
              id="logradouro"
              name="logradouro"
              value={formData.logradouro}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
              Número
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">
              Complemento
            </label>
            <input
              type="text"
              id="complemento"
              name="complemento"
              value={formData.complemento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">
              Bairro
            </label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade
            </label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            >
              <option value="">Selecione</option>
              {estadosBrasileiros.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Pesquisar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default PessoaJuridicaForm;