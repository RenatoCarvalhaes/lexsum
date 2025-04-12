export const cleanDocument = (doc: string): string => doc.replace(/\D/g, '');

export const isValidCPF = (cpf: string): boolean => {
  cpf = cleanDocument(cpf);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
  if (firstCheck !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
  return secondCheck === parseInt(cpf[10]);
};

export const isValidCNPJ = (cnpj: string): boolean => {
  cnpj = cleanDocument(cnpj);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calcCheckDigit = (base: string, multipliers: number[]) => {
    const sum = base
      .split('')
      .map((num, idx) => parseInt(num) * multipliers[idx])
      .reduce((acc, val) => acc + val, 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = cnpj.slice(0, 12);
  const firstDigit = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calcCheckDigit(base + firstDigit, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return cnpj === base + firstDigit.toString() + secondDigit.toString();
};

export const isValidDocument = (doc: string): boolean => {
  const clean = cleanDocument(doc);
  return isValidCPF(clean) || isValidCNPJ(clean);
};
