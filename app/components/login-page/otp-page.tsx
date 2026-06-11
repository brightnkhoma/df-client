"use client";

import { useApp } from "@/app/lib/hooks/useApp";
import { showToast } from "@/app/lib/toast/toast";
import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect, KeyboardEvent } from "react";
import { 
  Shield, Building2, Globe, Loader2, ArrowRight, 
  ArrowLeft, RefreshCw, Mail, Lock, AlertCircle
} from "lucide-react";

export const OTPPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { api } = useApp();
  const router = useRouter();

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === 'Enter' && otp.every(digit => digit)) {
      verifyOTP();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      setError("");
      inputRefs.current[5]?.focus();
    }
  };

  const verifyOTP = useCallback(async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError("Please enter the complete verification code");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      setError("");
      
      const success = await api.auth.verifyOTP(otpString);
      
      if (success) {
        showToast("success",{description:"Verification successful. Welcome to the portal."});
        router.replace("/");
      } else {
        setError("Invalid verification code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.log(error);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, otp, api, router]);

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    try {
      setCanResend(false);
      setResendTimer(120); // 2 minutes cooldown
      
      // Call resend OTP API
    //   await api.auth.resendOTP();
      
      showToast("success",{description:"New verification code sent to your email"});
      setOtp(["", "", "", "", "", ""]);
      setError("");
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.log(error);
      setError("Failed to resend code. Please try again.");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Left Side - Branding & Information */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: '60px 60px'
               }}
          />
          
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-800/5 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-16">
          {/* Top Section */}
          <div>
            {/* Institutional Logos */}
            <div className="flex items-center gap-6 mb-20">
              <div className="group">
                <div className="w-14 h-14 bg-white/[0.03] backdrop-blur-sm rounded-xl flex items-center justify-center 
                              border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                  <Building2 className="w-6 h-6 text-emerald-300/80" strokeWidth={1.5} />
                </div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="group">
                <div className="w-14 h-14 bg-white/[0.03] backdrop-blur-sm rounded-xl flex items-center justify-center 
                              border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                  <Globe className="w-6 h-6 text-emerald-300/80" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-emerald-400/60 text-xs font-medium tracking-[0.2em] uppercase">
                <span className="w-8 h-px bg-emerald-400/30" />
                Government Portal
              </div>
              
              <h1 className="text-5xl font-light tracking-tight text-white leading-tight">
                Development Fund
                <br />
                <span className="font-medium text-emerald-200">of Norway</span>
              </h1>
              
              <p className="text-base text-gray-400 font-light leading-relaxed max-w-md tracking-wide">
                Enter the verification code sent to your email to complete 
                the registration process.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-10">
            {/* Verification Steps */}
            <div className="space-y-4">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-gray-600">
                Verification Process
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-500 group cursor-default">
                  <div className="relative">
                    <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <span className="text-xs font-medium text-emerald-400/50 w-4 h-4 flex items-center justify-center">
                        ✓
                      </span>
                    </div>
                  </div>
                  <span className="text-xs tracking-wide text-gray-400">
                    Account credentials created
                  </span>
                </div>
                
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-sm transition-all duration-500" />
                    <div className="relative p-2 bg-white/[0.02] rounded-lg border border-emerald-500/20 
                                  transition-all duration-500">
                      <span className="text-xs font-medium text-emerald-400/70 w-4 h-4 flex items-center justify-center">
                        2
                      </span>
                    </div>
                  </div>
                  <span className="text-xs tracking-wide text-gray-300 transition-colors duration-500">
                    Verify your email with OTP code
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-500 group cursor-default">
                  <div className="relative">
                    <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04] 
                                  transition-all duration-500">
                      <span className="text-xs font-medium text-gray-600 w-4 h-4 flex items-center justify-center">
                        3
                      </span>
                    </div>
                  </div>
                  <span className="text-xs tracking-wide text-gray-500 transition-colors duration-500">
                    Access the agricultural development portal
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-3 text-gray-500 group cursor-default">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-sm group-hover:bg-emerald-500/30 transition-all duration-500" />
                <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04] 
                              group-hover:border-white/[0.08] transition-all duration-500">
                  <Shield className="w-3.5 h-3.5 text-emerald-400/70" strokeWidth={1.5} />
                </div>
              </div>
              <span className="text-xs tracking-wide text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                Secure verification process
              </span>
            </div>

            {/* Official Footer */}
            <div className="pt-8 border-t border-white/[0.04]">
              <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase text-gray-600">
                <span>Republic of Malawi</span>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span>&copy; {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo & Title */}
          <div className="lg:hidden mb-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <Building2 className="w-5 h-5 text-emerald-400/60" strokeWidth={1.5} />
              </div>
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <Globe className="w-5 h-5 text-emerald-400/60" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-500/40 text-[10px] font-medium tracking-[0.2em] uppercase mb-4">
              <span className="w-6 h-px bg-emerald-500/20" />
              Government Portal
            </div>
            <h1 className="text-2xl font-light tracking-tight text-white">
              Development Fund
              <br />
              <span className="font-medium text-emerald-200">of Norway</span>
            </h1>
          </div>

          {/* OTP Form */}
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light tracking-wide">Back to registration</span>
            </button>

            {/* Form Header */}
            <div className="space-y-2">
              <h2 className="text-xl font-light text-white tracking-tight">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-500 font-light tracking-wide">
                Enter the 6-digit code sent to your email address
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase text-gray-500 mb-4">
                  Verification Code
                </label>
                
                <div 
                  className="flex gap-3 justify-between"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-14 h-16 bg-white/[0.02] rounded-lg border text-center text-xl
                               font-light text-white placeholder:text-gray-700
                               outline-none transition-all duration-300
                               ${error
                                 ? 'border-red-500/30 focus:border-red-500/50'
                                 : digit
                                   ? 'border-emerald-500/30 focus:border-emerald-500/50'
                                   : 'border-white/[0.06] focus:border-emerald-500/30 hover:border-white/[0.1]'
                               }`}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-3 flex items-center gap-2 text-red-400/80">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-xs font-light tracking-wide">{error}</p>
                  </div>
                )}

                {/* Progress Indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500/50 transition-all duration-300"
                      style={{ width: `${(otp.filter(d => d).length / 6) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600 font-light tracking-wider">
                    {otp.filter(d => d).length}/6
                  </span>
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOTP}
                disabled={loading || otp.some(digit => !digit)}
                className="w-full py-3 px-6 bg-white/[0.03] text-gray-200 rounded-lg
                         border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]
                         focus:outline-none focus:border-emerald-500/30
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300 text-sm font-light tracking-wide
                         flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400/60" strokeWidth={1.5} />
                    <span className="text-gray-500">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Complete Registration</span>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400/60 group-hover:translate-x-1 transition-all duration-300" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>

            {/* Resend Section */}
            <div className="pt-6 border-t border-white/[0.04]">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-light tracking-wide">
                  Didn't receive the code?
                </p>
                
                {resendTimer > 0 ? (
                  <span className="text-xs text-gray-500 font-light tracking-wide flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 text-gray-600" strokeWidth={1.5} />
                    Resend in {formatTime(resendTimer)}
                  </span>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={!canResend}
                    className={`text-xs font-light tracking-wide flex items-center gap-1.5 transition-colors
                             ${canResend 
                               ? 'text-emerald-400/60 hover:text-emerald-400/80' 
                               : 'text-gray-600 cursor-not-allowed'
                             }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${canResend ? 'text-emerald-400/60' : 'text-gray-600'}`} strokeWidth={1.5} />
                    Resend code
                  </button>
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="p-4 bg-white/[0.01] rounded-lg border border-white/[0.04]">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="text-[11px] font-medium tracking-wider uppercase text-gray-600">
                    Check Your Email
                  </p>
                  <p className="text-xs text-gray-600 font-light leading-relaxed tracking-wide">
                    The verification code was sent to your registered email address. 
                    Check your spam folder if you don't see it in your inbox.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-6 border-t border-white/[0.04]">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-600/40 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="text-[11px] font-medium tracking-wider uppercase text-gray-600">
                    Secure Verification
                  </p>
                  <p className="text-xs text-gray-600 font-light leading-relaxed tracking-wide">
                    This code expires in 20 minutes. Never share this code with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[10px] tracking-widest uppercase text-gray-700">
              Republic of Malawi &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;