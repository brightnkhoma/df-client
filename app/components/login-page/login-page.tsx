"use client";

import { useApp } from "@/app/lib/hooks/useApp";
import { showToast } from "@/app/lib/toast/toast";
import { LoginProps } from "@/app/lib/types/loginProps";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { 
  Eye, EyeOff, Lock, Mail, ArrowRight, Shield, 
  Building2, Globe, Leaf, AlertCircle, Loader2
} from "lucide-react";

export const LoginPage = () => {
  const [loginProps, setLoginProps] = useState<LoginProps>({ 
    email: "", 
    password: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  });
  
  const { api, refresh } = useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    return undefined;
  };

  const handleFieldChange = (field: keyof LoginProps, value: string) => {
    setLoginProps(prev => ({ ...prev, [field]: value }));
    
    if ((touched as any)[field]) {
      const error = field === 'email' 
        ? validateEmail(value) 
        : validatePassword(value);
      
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleFieldBlur = (field: keyof LoginProps) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const error = field === 'email' 
      ? validateEmail(loginProps.email) 
      : validatePassword(loginProps.password);
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const onLogin = useCallback(async () => {
    const emailError = validateEmail(loginProps.email);
    const passwordError = validatePassword(loginProps.password);
    
    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });
    
    if (emailError || passwordError) return;
    if (loading) return;
    
    try {
      setLoading(true);
      const success = await api.auth.login(loginProps);
      
      if (success) {
        showToast("success",{description:"Authentication successful"});
        await refresh();
        router.replace("/");
        return;
      } else {
        showToast("error",{description:"Invalid credentials. Please verify your email and password."});
      }
    } catch (error) {
      console.log(error);
      showToast("error",{description:"Authentication service unavailable. Please try again."});
    } finally {
      setLoading(false);
    }
  }, [api, loading, loginProps, refresh, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onLogin();
    }
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
                Facilitating sustainable agricultural development and rural transformation 
                across the Republic of Malawi.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-10">
            {/* Feature Indicators */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-gray-500 group cursor-default">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-sm group-hover:bg-emerald-500/30 transition-all duration-500" />
                  <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04] 
                                group-hover:border-white/[0.08] transition-all duration-500">
                    <Shield className="w-3.5 h-3.5 text-emerald-400/70" strokeWidth={1.5} />
                  </div>
                </div>
                <span className="text-xs tracking-wide text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                  Secure Government Portal
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-500 group cursor-default">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-sm group-hover:bg-emerald-500/30 transition-all duration-500" />
                  <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04] 
                                group-hover:border-white/[0.08] transition-all duration-500">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400/70" strokeWidth={1.5} />
                  </div>
                </div>
                <span className="text-xs tracking-wide text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                  Agricultural Development Programs
                </span>
              </div>
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

      {/* Right Side - Login Form */}
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

          {/* Login Form */}
          <div className="space-y-8">
            {/* Form Header */}
            <div className="space-y-2">
              <h2 className="text-xl font-light text-white tracking-tight">Sign In</h2>
              <p className="text-sm text-gray-500 font-light tracking-wide">
                Enter your credentials to access the portal
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-xs font-medium tracking-wider uppercase text-gray-500"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={loginProps.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 bg-white/[0.02] rounded-lg border text-sm
                             placeholder:text-gray-600 placeholder:font-light
                             outline-none transition-all duration-300
                             ${errors.email && touched.email
                               ? 'border-red-500/30 focus:border-red-500/50 text-red-300'
                               : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200 hover:border-white/[0.1]'
                             }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-xs text-red-400/80 font-light tracking-wide">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-medium tracking-wider uppercase text-gray-500"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginProps.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-12 bg-white/[0.02] rounded-lg border text-sm
                             placeholder:text-gray-600 placeholder:font-light
                             outline-none transition-all duration-300
                             ${errors.password && touched.password
                               ? 'border-red-500/30 focus:border-red-500/50 text-red-300'
                               : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200 hover:border-white/[0.1]'
                             }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-600 hover:text-gray-400 transition-colors" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600 hover:text-gray-400 transition-colors" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-xs text-red-400/80 font-light tracking-wide">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Additional Options */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/[0.08] bg-white/[0.02] 
                             text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-0
                             cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 font-light tracking-wide group-hover:text-gray-400 transition-colors">
                    Remember me
                  </span>
                </label>
                
                <button
                  type="button"
                  className="text-xs text-gray-500 font-light tracking-wide hover:text-gray-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={onLogin}
                disabled={loading}
                className="w-full mt-2 py-3 px-6 bg-white/[0.03] text-gray-200 rounded-lg
                         border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]
                         focus:outline-none focus:border-emerald-500/30
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300 text-sm font-light tracking-wide
                         flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400/60" strokeWidth={1.5} />
                    <span className="text-gray-500">Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400/60 group-hover:translate-x-1 transition-all duration-300" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="pt-6 border-t border-white/[0.04]">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-600/40 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="text-[11px] font-medium tracking-wider uppercase text-gray-600">
                    Authorized Access Only
                  </p>
                  <p className="text-xs text-gray-600 font-light leading-relaxed tracking-wide">
                    This system is restricted to authorized personnel. 
                    All access attempts are monitored and logged.
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

export default LoginPage;