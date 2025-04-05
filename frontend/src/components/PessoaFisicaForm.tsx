import React, { useState } from 'react';

interface PessoaFisicaFormData {
  cpf: string;
  nome: string;
  genero: string;
  nomeSocial: string;
  identidade: string;
  orgaoExpedidor: string;
  dataExpedicao: string;
  nit: string;
  estadoCivil: string;
  profissao: string;
  nacionalidade: string;
  pai1: string;
  pai2: string;
  dataNascimento: string;
  cpfResponsavel: string;
  nomeResponsavel: string;
  email: string;
  celular: string;
  telefone: string;
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

function PessoaFisicaForm() {
  const [formData, setFormData] = useState<PessoaFisicaFormData>({
    cpf: '',
    nome: '',
    genero: '',
    nomeSocial: '',
    identidade: '',
    orgaoExpedidor: '',
    dataExpedicao: '',
    nit: '',
    estadoCivil: '',
    profissao: '',
    nacionalidade: '',
    pai1: '',
    pai2: '',
    dataNascimento: '',
    cpfResponsavel: '',
    nomeResponsavel: '',
    email: '',
    celular: '',
    telefone: '',
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Pessoa Física</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
              CPF*
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              required
              value={formData.cpf}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome*
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-2">
              Gênero
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Não Binário">Não Binário</option>
              <option value="Não Informar">Não Informar</option>
            </select>
          </div>

          <div>
            <label htmlFor="nomeSocial" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Social
            </label>
            <input
              type="text"
              id="nomeSocial"
              name="nomeSocial"
              value={formData.nomeSocial}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="identidade" className="block text-sm font-medium text-gray-700 mb-2">
              Identidade
            </label>
            <input
              type="text"
              id="identidade"
              name="identidade"
              value={formData.identidade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="orgaoExpedidor" className="block text-sm font-medium text-gray-700 mb-2">
              Órgão Expedidor
            </label>
            <input
              type="text"
              id="orgaoExpedidor"
              name="orgaoExpedidor"
              value={formData.orgaoExpedidor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dataExpedicao" className="block text-sm font-medium text-gray-700 mb-2">
              Data Expedição
            </label>
            <input
              type="date"
              id="dataExpedicao"
              name="dataExpedicao"
              value={formData.dataExpedicao}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="nit" className="block text-sm font-medium text-gray-700 mb-2">
              NIT
            </label>
            <input
              type="text"
              id="nit"
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="estadoCivil" className="block text-sm font-medium text-gray-700 mb-2">
              Estado Civil
            </label>
            <select
              id="estadoCivil"
              name="estadoCivil"
              value={formData.estadoCivil}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Desquitado(a)">Desquitado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Separado(a) de Fato">Separado(a) de Fato</option>
              <option value="Separado(a) Judicialmente">Separado(a) Judicialmente</option>
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
            </select>
          </div>

          <div>
            <label htmlFor="profissao" className="block text-sm font-medium text-gray-700 mb-2">
              Profissão
            </label>
            <input
              type="text"
              id="profissao"
              name="profissao"
              value={formData.profissao}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="nacionalidade" className="block text-sm font-medium text-gray-700 mb-2">
              Nacionalidade
            </label>
            <input
              type="text"
              id="nacionalidade"
              name="nacionalidade"
              value={formData.nacionalidade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="pai1" className="block text-sm font-medium text-gray-700 mb-2">
              Pai/Mãe
            </label>
            <input
              type="text"
              id="pai1"
              name="pai1"
              value={formData.pai1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="pai2" className="block text-sm font-medium text-gray-700 mb-2">
              Pai/Mãe
            </label>
            <input
              type="text"
              id="pai2"
              name="pai2"
              value={formData.pai2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
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
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
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

export default PessoaFisicaForm;