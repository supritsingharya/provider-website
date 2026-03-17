'use client'; // This component uses client-side state (useState) and event handlers

import React, { useState } from 'react'; // Removed FormEvent type for JS
import { FaPaperPlane } from 'react-icons/fa'; // Optional: for an icon in the button

const JoinCommunity = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => { // Removed type for event
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage('');

    if (!email) {
      setStatusMessage('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    // Basic email validation (optional, but good practice)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    // --- Replace with your actual API call to subscribe the user ---
    console.log('Subscribing email:', email);
    // Example:
    // try {
    //   const response = await fetch('/api/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     setStatusMessage('Thanks for joining! Please check your email to confirm.');
    //     setEmail(''); // Clear input on success
    //   } else {
    //     setStatusMessage(data.message || 'Something went wrong. Please try again.');
    //   }
    // } catch (error) {
    //   setStatusMessage('An error occurred. Please try again later.');
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End of API call example ---

    // For demonstration purposes without a real API:
    setTimeout(() => {
      setStatusMessage(`Thanks for joining, ${email}! Check your inbox (not really).`);
      setEmail(''); // Clear input
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="bg-slate-100 dark:bg-slate-800 py-16 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Join the Community
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          Be the first to hear about hostel offers, trips & internships.
        </p>

        <a
          href="https://whatsapp.com/channel/0029Va9LoeOBqbrEMejdkG3S"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
        >
          Join our WhatsApp Community
        </a>
      </div>
    </section>
  );
};

export default JoinCommunity;