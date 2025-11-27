import React, { useState } from 'react';
import { ShieldLogo } from './ShieldLogo';

// ---------------------------------------------------------
// CONFIGURATION:
// The specific Stripe Payment Link provided
// ---------------------------------------------------------
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq7sM9F69fz8Mr43Dfbq00"; 

export const PaymentGate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a192f] p-4">
      <div className="w-full max-w-md bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="p-8 md:p-10 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-navy-900 rounded-full flex items-center justify-center ring-4 ring-navy-700 shadow-xl">
               <ShieldLogo className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SAFEMEDIA</h1>
          <p className="text-navy-300 text-sm mb-8">Premium AI Media Screening</p>

          <div className="bg-navy-900/50 rounded-xl p-6 border border-navy-700 mb-8">
            <div className="flex justify-between items-end mb-1">
              <span className="text-navy-300 font-medium">Lifetime Access</span>
              <span className="text-3xl font-bold text-white">$4.00</span>
            </div>
            <div className="h-px w-full bg-navy-700 my-4"></div>
            <ul className="text-left space-y-3">
              <li className="flex items-center text-sm text-navy-200">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Unlimited Media Analysis
              </li>
              <li className="flex items-center text-sm text-navy-200">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Detailed Parental Guidance
              </li>
              <li className="flex items-center text-sm text-navy-200">
                <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Voice Input Support
              </li>
            </ul>
          </div>

          <a 
            href={STRIPE_PAYMENT_LINK}
            onClick={(e) => {
              // Prevent double clicks if already loading
              if (isLoading) {
                e.preventDefault();
                return;
              }
              setIsLoading(true);
            }}
            className="w-full bg-[#635BFF] hover:bg-[#5851E3] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 group cursor-pointer text-center no-underline"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting...
              </>
            ) : (
              <>
                Pay $4.00 Securely
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </a>

          <p className="mt-6 text-[10px] text-navy-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-500"></span>
            Powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};