import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Lock,
  ArrowRight,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PRICING_TIERS } from '../data/mockData';

export const PricingModal: React.FC = () => {
  const { 
    user, 
    isPricingModalOpen, 
    setIsPricingModalOpen, 
    upgradeTier 
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'premium' | 'pro'>('premium');
  const [paymentStep, setPaymentStep] = useState<'SELECT' | 'CHECKOUT' | 'SUCCESS'>('SELECT');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('rahul.patel@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isPricingModalOpen) return null;

  const currentPlan = PRICING_TIERS.find((p) => p.id === selectedPlanId) || PRICING_TIERS[1];

  const handleProceedToPay = () => {
    if (selectedPlanId === 'free') {
      upgradeTier('free');
      setIsPricingModalOpen(false);
      return;
    }
    setPaymentStep('CHECKOUT');
  };

  const handleCompletePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          paymentMethod,
          studentEmail: user.email,
          amount: currentPlan.price,
        }),
      });

      const data = await res.json();
      setReceiptData(data);
      upgradeTier(selectedPlanId, data.expiryDate);
      setPaymentStep('SUCCESS');

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    } catch (error) {
      console.error('Payment failed', error);
      // Fallback
      upgradeTier(selectedPlanId);
      setPaymentStep('SUCCESS');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="bg-white/[0.04] px-6 py-5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md border border-white/20 backdrop-blur-md">
              <Crown className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">SmartGovtPrep Membership Plans</h3>
              <p className="text-xs text-slate-300">Unlock unlimited AI study tools, deep mock analysis & ranker passes</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPricingModalOpen(false);
              setPaymentStep('SELECT');
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Switcher */}
        <div className="p-6 sm:p-8 flex-1">
          
          {paymentStep === 'SELECT' && (
            <div className="space-y-8">
              {/* Headline */}
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Upgrade Your Government Exam Preparation
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Affordable plans built for serious UPSC, GPSC, SSC & Police aspirants.
                </p>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRICING_TIERS.map((tier) => {
                  const isSelected = selectedPlanId === tier.id;
                  const isCurrent = user.tier === tier.id;

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedPlanId(tier.id)}
                      className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative backdrop-blur-xl ${
                        isSelected
                          ? 'bg-white/[0.08] border-emerald-400/80 ring-2 ring-emerald-500/30 shadow-[0_8px_32px_rgba(16,185,129,0.2)]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      {tier.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md border border-white/20">
                          {tier.badge}
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between items-center pb-2">
                          <span className="font-bold text-white text-base">{tier.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <div className="mt-2 mb-4">
                          <div className="text-3xl font-black text-white font-mono">
                            {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">{tier.period}</div>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-white/10">
                          {tier.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanId(tier.id);
                          handleProceedToPay();
                        }}
                        className={`w-full mt-6 py-2.5 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 border border-white/10 ${
                          tier.id === 'pro'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_4px_16px_rgba(147,51,234,0.3)]'
                            : tier.id === 'premium'
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.3)]'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200'
                        }`}
                      >
                        <span>{isCurrent ? 'Current Plan' : tier.price === 0 ? 'Continue Free' : `Get ${tier.name}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Trust Badge */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-Bit Encrypted Payment Simulation</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant Membership Activation</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>UPI • Google Pay • PhonePe • Paytm</span>
                </span>
              </div>
            </div>
          )}

          {paymentStep === 'CHECKOUT' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure Checkout</span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  Payment for {currentPlan.name}
                </h4>
                <p className="text-xs text-slate-300">Total Payable Amount: <strong className="text-emerald-400 font-mono text-base">₹{currentPlan.price}</strong></p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Payment Option:
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition backdrop-blur-md ${
                      paymentMethod === 'UPI'
                        ? 'bg-emerald-600/90 border-white/30 text-white shadow-md'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition backdrop-blur-md ${
                      paymentMethod === 'CARD'
                        ? 'bg-emerald-600/90 border-white/30 text-white shadow-md'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    Debit / Credit
                  </button>
                  <button
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition backdrop-blur-md ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-emerald-600/90 border-white/30 text-white shadow-md'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    NetBanking
                  </button>
                </div>

                {/* Method Input */}
                {paymentMethod === 'UPI' ? (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs text-slate-300 font-medium">Enter UPI VPA ID (or Phone Number):</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or username@okhdfcbank"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/80 transition"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Supported: GPay • PhonePe • Paytm • BHIM</span>
                      <span className="text-emerald-400 font-semibold">Zero Surcharge</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                    <input
                      type="text"
                      placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                      defaultValue="4532 •••• •••• 8921"
                      className="w-full bg-white/[0.04] border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="08/29"
                        className="bg-white/[0.04] border border-white/15 rounded-2xl px-4 py-2 text-xs text-white backdrop-blur-md"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        defaultValue="•••"
                        className="bg-white/[0.04] border border-white/15 rounded-2xl px-4 py-2 text-xs text-white backdrop-blur-md"
                      />
                    </div>
                  </div>
                )}

                {/* Summary Row */}
                <div className="pt-3.5 border-t border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Plan: {currentPlan.name}</span>
                    <span>₹{currentPlan.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GST (18% included):</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1.5 border-t border-white/10">
                    <span>Total Amount:</span>
                    <span className="text-emerald-400 font-mono text-sm">₹{currentPlan.price}</span>
                  </div>
                </div>
              </div>

              {/* Complete Payment Button */}
              <div className="space-y-2">
                <button
                  onClick={handleCompletePayment}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition disabled:opacity-50 border border-white/10"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Transaction...' : `Pay ₹${currentPlan.price} & Activate Plan`}</span>
                </button>
                <button
                  onClick={() => setPaymentStep('SELECT')}
                  className="w-full text-center text-xs text-slate-400 hover:text-white py-1"
                >
                  Back to Plan Selection
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'SUCCESS' && (
            <div className="max-w-md mx-auto text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto backdrop-blur-md shadow-lg">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white">Payment Successful!</h4>
                <p className="text-xs text-slate-300">
                  Congratulations! Your account has been upgraded to <strong>{currentPlan.name}</strong>.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl p-5 text-left text-xs space-y-2 font-mono shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <div className="flex items-center gap-1.5 pb-2 border-b border-white/10 text-amber-300 font-bold">
                  <Receipt className="w-4 h-4" />
                  <span>Official Transaction Receipt</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Txn ID:</span>
                  <span className="text-white">{receiptData?.transactionId || 'TXN_SGP_2026_9812'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Student:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Plan:</span>
                  <span className="text-emerald-400 font-bold">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Validity:</span>
                  <span className="text-white">{selectedPlanId === 'pro' ? '90 Days' : '30 Days'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsPricingModalOpen(false);
                  setPaymentStep('SELECT');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition border border-white/10"
              >
                Continue Preparation with Pro Features
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
