"use client";

import { useApp } from "@/app/lib/hooks/useApp";
import { SignUpProps } from "@/app/lib/types/signUpProps";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { 
  Eye, EyeOff, Lock, Mail, ArrowRight, Shield, 
  Building2, Globe, Leaf, Loader2, User, UserPlus,
  AlertCircle, Check
} from "lucide-react";
import { showToast } from "@/app/lib/toast/toast";

export const SignUpPage = () => {
  const [signUpProps, setSignUpProps] = useState<SignUpProps>({
    email: "",
    name: "",
    password: "",
    userName: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    password?: string;
    userName?: string;
  }>({});
  const [touched, setTouched] = useState({
    email: false,
    name: false,
    password: false,
    userName: false
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const { api } = useApp();
  const router = useRouter();

  // Validation
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateUserName = (userName: string): string | undefined => {
    if (!userName.trim()) return "Username is required";
    if (userName.trim().length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(userName)) return "Username can only contain letters, numbers, and underscores";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return undefined;
  };

  const handleFieldChange = (field: keyof SignUpProps, value: string) => {
    setSignUpProps(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = getValidationError(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleFieldBlur = (field: keyof SignUpProps) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = getValidationError(field, signUpProps[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const getValidationError = (field: keyof SignUpProps, value: string): string | undefined => {
    switch (field) {
      case 'email': return validateEmail(value);
      case 'name': return validateName(value);
      case 'userName': return validateUserName(value);
      case 'password': return validatePassword(value);
      default: return undefined;
    }
  };

  const isFormValid = (): boolean => {
    return !validateEmail(signUpProps.email) && 
           !validateName(signUpProps.name) && 
           !validateUserName(signUpProps.userName) && 
           !validatePassword(signUpProps.password);
  };

  const onRegister = useCallback(async () => {
    // Validate all fields
    const emailError = validateEmail(signUpProps.email);
    const nameError = validateName(signUpProps.name);
    const userNameError = validateUserName(signUpProps.userName);
    const passwordError = validatePassword(signUpProps.password);
    
    setErrors({
      email: emailError,
      name: nameError,
      userName: userNameError,
      password: passwordError
    });
    setTouched({
      email: true,
      name: true,
      userName: true,
      password: true
    });
    
    if (emailError || nameError || userNameError || passwordError) return;
    if (loading) return;
    
    try {
      setLoading(true);
      const success = await api.auth.getOTP(signUpProps);
      
      if (success) {
        showToast("success",{description:"Verification code sent to your email"});
        router.push("/register/otp");
      } else {
        showToast("error",{description:"Registration failed. Please try again."});
      }
    } catch (error) {
      console.log(error);
      showToast("error",{description:"An error occurred. Please try again later."});
    } finally {
      setLoading(false);
    }
  }, [loading, api, signUpProps, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid()) {
      onRegister();
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-700' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500/50' };
    if (score <= 4) return { strength: 2, label: 'Fair', color: 'bg-amber-500/50' };
    if (score <= 5) return { strength: 3, label: 'Good', color: 'bg-emerald-500/50' };
    return { strength: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(signUpProps.password);

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
                Register for access to the agricultural development portal. 
                Join our mission to support sustainable farming across Malawi.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-10">
            {/* Registration Steps */}
            <div className="space-y-4">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-gray-600">
                Registration Process
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-500 group cursor-default">
                  <div className="relative">
                    <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04] 
                                  group-hover:border-emerald-500/20 transition-all duration-500">
                      <span className="text-xs font-medium text-emerald-400/50 w-4 h-4 flex items-center justify-center">
                        1
                      </span>
                    </div>
                  </div>
                  <span className="text-xs tracking-wide text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    Create your account credentials
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-500 group cursor-default">
                  <div className="relative">
                    <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04] 
                                  group-hover:border-emerald-500/20 transition-all duration-500">
                      <span className="text-xs font-medium text-emerald-400/50 w-4 h-4 flex items-center justify-center">
                        2
                      </span>
                    </div>
                  </div>
                  <span className="text-xs tracking-wide text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    Verify your email with OTP code
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-500 group cursor-default">
                  <div className="relative">
                    <div className="relative p-2 bg-white/[0.02] rounded-lg border border-white/[0.04] 
                                  group-hover:border-emerald-500/20 transition-all duration-500">
                      <span className="text-xs font-medium text-emerald-400/50 w-4 h-4 flex items-center justify-center">
                        3
                      </span>
                    </div>
                  </div>
                  <span className="text-xs tracking-wide text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    Access the agricultural development portal
                  </span>
                </div>
              </div>
            </div>

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

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-[400px] py-8">
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

          {/* Registration Form */}
          <div className="space-y-8">
            {/* Form Header */}
            <div className="space-y-2">
              <h2 className="text-xl font-light text-white tracking-tight">Create Account</h2>
              <p className="text-sm text-gray-500 font-light tracking-wide">
                Register to access the agricultural development portal
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="name" 
                  className="block text-xs font-medium tracking-wider uppercase text-gray-500"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={signUpProps.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleFieldBlur('name')}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-white/[0.02] rounded-lg border text-sm
                             placeholder:text-gray-600 placeholder:font-light
                             outline-none transition-all duration-300
                             ${errors.name && touched.name
                               ? 'border-red-500/30 focus:border-red-500/50 text-red-300'
                               : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200 hover:border-white/[0.1]'
                             }`}
                    autoComplete="name"
                  />
                </div>
                {errors.name && touched.name && (
                  <p className="text-xs text-red-400/80 font-light tracking-wide">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="userName" 
                  className="block text-xs font-medium tracking-wider uppercase text-gray-500"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="userName"
                    type="text"
                    value={signUpProps.userName}
                    onChange={(e) => handleFieldChange('userName', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    onBlur={() => handleFieldBlur('userName')}
                    onKeyDown={handleKeyDown}
                    placeholder="Choose a username"
                    className={`w-full px-4 py-3 bg-white/[0.02] rounded-lg border text-sm
                             placeholder:text-gray-600 placeholder:font-light
                             outline-none transition-all duration-300
                             ${errors.userName && touched.userName
                               ? 'border-red-500/30 focus:border-red-500/50 text-red-300'
                               : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200 hover:border-white/[0.1]'
                             }`}
                    autoComplete="username"
                  />
                </div>
                {errors.userName && touched.userName && (
                  <p className="text-xs text-red-400/80 font-light tracking-wide">
                    {errors.userName}
                  </p>
                )}
              </div>

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
                    value={signUpProps.email}
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
                    value={signUpProps.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    onKeyDown={handleKeyDown}
                    placeholder="Create a strong password"
                    className={`w-full px-4 py-3 pr-12 bg-white/[0.02] rounded-lg border text-sm
                             placeholder:text-gray-600 placeholder:font-light
                             outline-none transition-all duration-300
                             ${errors.password && touched.password
                               ? 'border-red-500/30 focus:border-red-500/50 text-red-300'
                               : 'border-white/[0.06] focus:border-emerald-500/30 text-gray-200 hover:border-white/[0.1]'
                             }`}
                    autoComplete="new-password"
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
                
                {/* Password Strength Indicator */}
                {signUpProps.password && (
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-gray-800'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-light tracking-wide ${
                      passwordStrength.strength <= 1 ? 'text-red-400/60' :
                      passwordStrength.strength <= 2 ? 'text-amber-400/60' :
                      'text-emerald-400/60'
                    }`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
                
                {errors.password && touched.password && (
                  <p className="text-xs text-red-400/80 font-light tracking-wide">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="space-y-1.5">
                {[
                  { test: (p: string) => p.length >= 8, text: 'At least 8 characters' },
                  { test: (p: string) => /[A-Z]/.test(p), text: 'One uppercase letter' },
                  { test: (p: string) => /[a-z]/.test(p), text: 'One lowercase letter' },
                  { test: (p: string) => /[0-9]/.test(p), text: 'One number' },
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
                                  transition-all duration-300 ${
                                    signUpProps.password && req.test(signUpProps.password)
                                      ? 'bg-emerald-500/20 text-emerald-400/60'
                                      : 'bg-gray-800 text-gray-600'
                                  }`}>
                      <Check className="w-2.5 h-2.5" strokeWidth={2} />
                    </div>
                    <span className={`text-[11px] font-light tracking-wide transition-colors duration-300 ${
                      signUpProps.password && req.test(signUpProps.password)
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={onRegister}
                disabled={loading || !isFormValid()}
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
                    <span className="text-gray-500">Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Verification</span>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400/60 group-hover:translate-x-1 transition-all duration-300" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="pt-6 border-t border-white/[0.04] text-center">
              <p className="text-xs text-gray-600 font-light tracking-wide">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-emerald-400/60 hover:text-emerald-400/80 transition-colors font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="pt-6 border-t border-white/[0.04]">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-600/40 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="text-[11px] font-medium tracking-wider uppercase text-gray-600">
                    Secure Registration
                  </p>
                  <p className="text-xs text-gray-600 font-light leading-relaxed tracking-wide">
                    Your information is encrypted and protected. 
                    Only authorized personnel can access this system.
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

export default SignUpPage;