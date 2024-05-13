import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const RAZORPAY_KEY = "KEY_ID";
const SERVER_URL = "http://localhost:1337";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.body.appendChild(script);
  });
}

async function fetchOrderDetails(amount, currency) {
  const response = await fetch(`${SERVER_URL}/razorpay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency }),
  });

  if (!response.ok) throw new Error('Failed to fetch Razorpay data');
  return response.json();
}

async function verifyPayment() {
  const response = await fetch(`${SERVER_URL}/razorpay/verify`, { method: 'POST' });
  if (!response.ok) throw new Error('Razorpay Verification Failed');
  return response.json();
}

function App() {
  const [paymentStatus, setPaymentStatus] = useState(null);

  async function displayRazorpay() {
    try {
      const isScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isScriptLoaded) throw new Error('Razorpay SDK failed to load. Are you online?');

      const orderDetails = await fetchOrderDetails(500, 'INR');

      const options = {
        key: RAZORPAY_KEY,
        currency: orderDetails.currency,
        amount: orderDetails.amount.toString(),
        order_id: orderDetails.id,
        name: 'Donation',
        description: 'Thank you for your support!',
        image: `${SERVER_URL}/logo.svg`,
        handler: async function (response) {
          alert(`Payment ID: ${response.razorpay_payment_id}`);
          alert(`Order ID: ${response.razorpay_order_id}`);
          alert(`Signature: ${response.razorpay_signature}`);

          try {
            const verificationResult = await verifyPayment();
            setPaymentStatus('Payment successful');
            console.log('Verification Result:', verificationResult);
          } catch (error) {
            setPaymentStatus('Payment Verification Failed');
            console.error(error.message);
          }
        },
        prefill: {
          email: 'random@gmail.com',
          contact: '4204209211',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error.message);
      setPaymentStatus('Payment Failed');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Make A Donation</h1>
        <p>Help Us Make A Difference!!!</p>
        <button className="App-link" onClick={displayRazorpay}>
          Donate Rs. 500
        </button>
        {paymentStatus && <p>{paymentStatus}</p>}
      </header>
    </div>
  );
}

export default App;