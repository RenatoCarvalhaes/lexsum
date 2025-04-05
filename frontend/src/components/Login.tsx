import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';
import EmailVerification from './EmailVerification';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

function Login({ onLogin }: LoginProps) {
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Requisitos de senha
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { label: 'Pelo menos 6 caracteres', test: (pwd) => pwd.length >= 6, met: false },
    { label: 'Pelo menos uma letra maiúscula', test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { label: 'Pelo menos uma letra minúscula', test: (pwd) => /[a-z]/.test(pwd), met: false },
    { label: 'Pelo menos um número', test: (pwd) => /[0-9]/.test(pwd), met: false },
    { label: 'Pelo menos um caractere especial', test: (pwd) => /[!@#$%^&*()_\-+={[}\]|:;"'<,>.?/\\]/.test(pwd), met: false }
  ]);

  // Formatação do telefone
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      let formatted = numbers;
      if (numbers.length > 0) formatted = `(${formatted}`;
      if (numbers.length > 2) formatted = `${formatted.slice(0,3)}) ${formatted.slice(3)}`;
      if (numbers.length > 3) formatted = `${formatted.slice(0,5)} ${formatted.slice(5)}`;
      if (numbers.length > 7) formatted = `${formatted.slice(0,10)}-${formatted.slice(10)}`;
      return formatted;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // Validação do formulário
  useEffect(() => {
    const updatedRequirements = requirements.map(req => ({
      ...req,
      met: req.test(password)
    }));
    setRequirements(updatedRequirements);

    if (updatedRequirements.every(req => req.met)) {
      setPasswordError('');
    }

    const arePasswordRequirementsMet = updatedRequirements.every(req => req.met);
    const doPasswordsMatch = password === confirmPassword;
    const isSignupFormValid = arePasswordRequirementsMet && doPasswordsMatch && 
      Boolean(name) && Boolean(email) && Boolean(phone);
    const isLoginFormValid = Boolean(email) && Boolean(password);

    setIsFormValid(isSignup ? isSignupFormValid : isLoginFormValid);
  }, [password, confirmPassword, name, email, phone, isSignup]);

  useEffect(() => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError('As senhas não coincidem');
      } else {
        setPasswordError('');
      }
    }
  }, [password, confirmPassword]);

  // Funções de manipulação
  const validatePasswords = () => {
    if (!requirements.every(req => req.met)) {
      setPasswordError('A senha não atende aos requisitos mínimos');
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando submit...");
    setErrorMessage('');
    setIsLoading(true);
  
    try {
      if (isSignup) {
        if (!validatePasswords()) {
          setIsLoading(false);
          return;
        }
  
        const response = await axios.post(
          'http://localhost:8000/signup',
          {
            nome: name,
            email,
            telefone: phone.replace(/\D/g, ''),
            senha: password
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 5000
          }
        );
  
        console.log("Resposta do backend:", response.data);
  
        if (response.data?.status === "pending_verification") {
          setShowVerification(true);
        } else {
          // Evite assumir que qualquer resposta é sucesso
          setErrorMessage(response.data?.message || 'Cadastro já realizado. Verifique seu email para confirmação do código.');
        }
  
      } else {
        const response = await axios.post(
          'http://localhost:8000/login',
          {
            email,
            senha: password
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log("Login realizado com sucesso!");
        onLogin(email, password);
      }
  
    } catch (error: any) {
      console.error("Erro completo:", error);
  
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
  
        if (detail) {
          setErrorMessage(detail);
        } else if (error.response?.status === 409) {
          setErrorMessage("Email já cadastrado");
        } else {
          setErrorMessage(isSignup
            ? 'Erro ao realizar cadastro. Tente novamente.'
            : 'Erro ao realizar login. Verifique suas credenciais.');
        }
      } else {
        setErrorMessage("Erro inesperado. Tente novamente.");
      }
  
    } finally {
      setIsLoading(false);
    }
  };
    
  
  const handleVerificationComplete = () => {
    setIsSignup(false);
    setShowVerification(false);
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('Cadastro verificado com sucesso! Faça login.');
  };

  if (showVerification) {
    return (
      <EmailVerification
        email={email}
        onVerificationComplete={handleVerificationComplete}
        onBack={() => {
          setShowVerification(false);
          setErrorMessage('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-500 p-3 rounded-full">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">LexSum</h2>
          <p className="mt-2 text-gray-600">Sistema de Sumarização Legal</p>
        </div>

        {errorMessage && (
          <div className={`mb-4 p-3 rounded ${errorMessage.includes('sucesso') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
            <div className="flex items-center">
              {errorMessage.includes('sucesso') ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {isSignup && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Celular
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(99) 9 9999-9999"
                maxLength={17}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 
                  ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
                    'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {isSignup && (passwordTouched || password) && (
              <div className="mt-2 space-y-2">
                <p className="text-sm font-medium text-gray-700">A senha deve conter:</p>
                <div className="space-y-1">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm">
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={req.met ? 'text-green-700' : 'text-red-700'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 
                    ${passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
                      'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordError && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {passwordError}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignup ? 'Cadastrando...' : 'Entrando...'}
              </span>
            ) : (
              isSignup ? 'Cadastrar' : 'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setShowPassword(false);
              setShowConfirmPassword(false);
              setPassword('');
              setConfirmPassword('');
              setPasswordError('');
              setPasswordTouched(false);
              setErrorMessage('');
            }}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isSignup ? 'Já possui conta? Entre aqui' : 'Não possui conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;