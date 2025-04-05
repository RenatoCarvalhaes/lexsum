import React from 'react';

function Footer() {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearDisplay = currentYear > startYear 
    ? `${startYear}-${currentYear}`
    : startYear.toString();

  return (
    <footer className="mt-auto py-4 px-6 border-t border-gray-200">
      <div className="text-center text-sm text-gray-600">
        © {yearDisplay} LexSum. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Footer;