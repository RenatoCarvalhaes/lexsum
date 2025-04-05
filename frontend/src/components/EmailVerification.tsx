import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

function EmailVerification({ email, onVerificationComplete, onBack }: EmailVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && isTimerActive) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
      setIsTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // If all digits are filled, submit automatically
    if (newCode.every(digit => digit) && value) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/[0-9]/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setCode(newCode);
    if (newCode.every(digit => digit)) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleSubmit = async (verificationCode: string) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axios.post("http://localhost:8000/verificar-codigo", {
        email,
        codigo: verificationCode
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      console.log("Verificação:", response.data);
      setSuccess(true);
      setTimeout(() => {
        onVerificationComplete();
      }, 1000);
  
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao verificar código');
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTimeLeft(120);
      setCanResend(false);
      setIsTimerActive(true);
    } catch (err) {
      setError('Erro ao reenviar código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificação de Email</h2>
        <p className="text-gray-600 mb-6">
          Digite o código de 6 dígitos enviado para {email}
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-12 h-12 text-center text-2xl font-bold border rounded-lg
                ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
                  'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
                focus:outline-none focus:ring-2 transition-colors`}
              disabled={isLoading || success}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center text-red-600 mb-4">
            <XCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-600 mb-4">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span className="text-sm">Código verificado com sucesso!</span>
          </div>
        )}

        <div className="text-center">
          {!canResend ? (
            <p className="text-sm text-gray-600">
              Reenviar código em {formatTime(timeLeft)}
            </p>
          ) : (
            <button
              onClick={handleResendCode}
              disabled={isLoading || !canResend}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none disabled:opacity-50"
            >
              Reenviar código
            </button>
          )}
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;