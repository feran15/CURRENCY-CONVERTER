import React, { useState, useEffect } from 'react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState({});
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    setError(''); // Reset error before fetching
    try {
      const response = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_ksFQq7lrLOJi38EyDke6XrDY0WEMdvDpZnhwDfAB');
      const data = await response.json();
      setExchangeRates(data.data);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load exchange rates. Please try again later.');
      console.error('Error fetching exchange rates:', error);
      setIsLoading(false);
    }
  };

  const handleConvert = () => {
    if (isLoading || !exchangeRates || amount <= 0) return;

    const fromRate = fromCurrency === 'USD' ? 1 : exchangeRates[fromCurrency]?.value || 1;
    const toRate = toCurrency === 'USD' ? 1 : exchangeRates[toCurrency]?.value || 1;
    const convertedAmount = (amount / fromRate) * toRate;
    setResult(convertedAmount.toFixed(2));
  };

  return (
    <div 
      style={{ 
        backgroundImage: "url('/AdobeStock.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: '',
        height: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ 
        maxWidth: '400px', 
        padding: '20px', 
        border: '1px solid #ccc',   
        borderRadius: '10px', 
        backgroundColor: 'rgba(255, 255, 255, 0.85)' 
      }}>
        <h2 style={{ textAlign: 'center' }}>Currency Converter</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
          min="0"
        />
        {amount <= 0 && (
          <p style={{ color: 'red', marginTop: '-10px', marginBottom: '10px' }}>
            Please enter a valid amount greater than 0.
          </p>
        )}
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        >
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
        >
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <button 
          onClick={handleConvert}
          disabled={isLoading || amount <= 0}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: isLoading || amount <= 0 ? '#cccccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isLoading || amount <= 0 ? 'not-allowed' : 'pointer' 
          }}
        >
          {isLoading ? 'Loading...' : 'Convert'}
        </button>
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>
        )}
        {result && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>
              {amount} {fromCurrency} = {result} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
