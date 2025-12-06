import React, { useState } from 'react';

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setExpression('');
      return;
    }
    if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const res = eval(expression + display);
        setDisplay(String(res));
        setExpression('');
      } catch {
        setDisplay('Error');
      }
      return;
    }
    if (['+', '-', '*', '/'].includes(val)) {
      setExpression(expression + display + val);
      setDisplay('0');
      return;
    }

    setDisplay(prev => prev === '0' ? val : prev + val);
  };

  const buttons = [
    'C', '(', ')', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div className="flex flex-col h-full bg-[#202020] text-white">
      <div className="flex-1 flex flex-col justify-end items-end p-6 gap-2">
        <div className="text-gray-400 text-sm h-5">{expression}</div>
        <div className="text-5xl font-light tracking-tight">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#202020]">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={() => handlePress(btn)}
            className={`
              aspect-square rounded flex items-center justify-center text-xl transition-colors
              ${btn === '=' ? 'col-span-2 bg-blue-600 hover:bg-blue-500' : ''}
              ${['+', '-', '*', '/'].includes(btn) ? 'bg-[#323232] hover:bg-[#3e3e3e] text-blue-400' : ''}
              ${!['=', '+', '-', '*', '/'].includes(btn) && btn !== 'C' ? 'bg-[#3b3b3b] hover:bg-[#323232]' : ''}
              ${btn === 'C' ? 'bg-[#323232] hover:bg-[#3e3e3e] text-red-400' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorApp;