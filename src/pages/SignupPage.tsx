import React, { useState } from 'react';
import { Page, UserProfile } from '../types';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { fetchUserProfile, saveUserProfile } from '../lib/userService';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
  onSignupSuccess: (userProfile: UserProfile) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const translateFirebaseError = (errCode: string): string => {
    switch (errCode) {
      case 'auth/operation-not-allowed':
        return 'Firebase 프로젝트에서 [이메일/비밀번호] 로그인이 활성화되지 않았습니다. 상단의 [Google 계정으로 빠른 가입]을 이용하시거나 Firebase 콘솔에서 이메일 제공업체를 활성화해 주세요.';
      case 'auth/email-already-in-use':
        return '이미 등록된 이메일 주소입니다. 로그인 페이지에서 로그인해 주세요.';
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 형식입니다.';
      case 'auth/weak-password':
        return '비밀번호 보안 강도가 약합니다. 영문, 숫자 포함 8자 이상 입력해 주세요.';
      case 'auth/network-request-failed':
        return '네트워크 연결 상태를 확인해 주세요.';
      case 'auth/popup-closed-by-user':
        return 'Google 로그인 창이 닫혔습니다.';
      default:
        return `회원가입 처리 중 문제가 발생했습니다 (${errCode || '오류'}). 다시 시도해 주세요.`;
    }
  };

  // Password strength calculation
  const getPasswordStrength = (val: string) => {
    if (!val) return { level: 0, text: '보안 강도', color: 'text-outline' };
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Za-z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val) && val.length >= 10) score++;

    if (score === 1) return { level: 1, text: '보안: 취약', color: 'text-status-danger' };
    if (score === 2) return { level: 2, text: '보안: 적정', color: 'text-secondary' };
    if (score >= 3) return { level: 3, text: '보안: 안전', color: 'text-status-success' };
    return { level: 1, text: '보안: 취약', color: 'text-status-danger' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = passwordConfirm.length > 0 && password === passwordConfirm;
  const passwordsMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('서비스 이용약관 및 개인정보 처리방침에 동의해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (name.trim()) {
        try {
          await updateProfile(user, { displayName: name.trim() });
        } catch (updateErr) {
          console.warn('Profile name update skipped:', updateErr);
        }
      }

      const newProfile: UserProfile = {
        uid: user.uid,
        name: name.trim() || user.displayName || email.split('@')[0] || '신규 학습자',
        email: user.email || email.trim(),
        role: '학생 회원',
        avatarUrl:
          user.photoURL ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuApUAMNzsTk57j_L6mIn_c0M5hJnMWasSv310CrU24wT8HYPCTb6v6vEyy-j1zuk9Oz8DIKYvyCwHUTG1_viTaaoKtKNJsVNKUmYs_L6IgyZYISryezMwQkMjbO0-IfsByGjw967hC4x2ETXla7-7I3Bjd15OgzTHEKP8HwcuulKDL4IcBvD9GmKBOGwG9zqN-ytTwsq4yXCa1ZHdit9Vq85U3tToi8PFjHBA-LHy6r5SvL0HYqKkd8',
        joinedDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
        daysActive: 1,
        consultationCount: 0,
        targetGoal: '자기주도 학습 역량 강화',
        coachingStyle: '주간 계획 코칭',
        studyCategory: 'cs',
        consultTone: 'mentor',
        notifyGoals: true,
        notifyReport: true,
        agreeDataTraining: false
      };

      await saveUserProfile(user.uid, newProfile);
      onSignupSuccess(newProfile);
      onNavigate('chat-consultation');
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      setErrorMessage(translateFirebaseError(fbErr.code || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMessage('');
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let profile = await fetchUserProfile(user.uid);
      if (!profile) {
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || '구글 학습자',
          email: user.email || '',
          role: '학생 회원',
          avatarUrl:
            user.photoURL ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuApUAMNzsTk57j_L6mIn_c0M5hJnMWasSv310CrU24wT8HYPCTb6v6vEyy-j1zuk9Oz8DIKYvyCwHUTG1_viTaaoKtKNJsVNKUmYs_L6IgyZYISryezMwQkMjbO0-IfsByGjw967hC4x2ETXla7-7I3Bjd15OgzTHEKP8HwcuulKDL4IcBvD9GmKBOGwG9zqN-ytTwsq4yXCa1ZHdit9Vq85U3tToi8PFjHBA-LHy6r5SvL0HYqKkd8',
          joinedDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
          daysActive: 1,
          consultationCount: 0,
          targetGoal: '자기주도 학습 역량 강화',
          coachingStyle: '주간 계획 코칭',
          studyCategory: 'cs',
          consultTone: 'mentor',
          notifyGoals: true,
          notifyReport: true,
          agreeDataTraining: false
        };
        await saveUserProfile(user.uid, newProfile);
        profile = newProfile;
      }

      onSignupSuccess(profile);
      onNavigate('chat-consultation');
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      if (fbErr.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(translateFirebaseError(fbErr.code || ''));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface relative overflow-hidden py-10 px-4 sm:px-6">
      {/* Subtle Ambient Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-[460px] bg-surface-card border border-border-subtle rounded-3xl shadow-2xl p-7 sm:p-9 flex flex-col z-10 backdrop-blur-md">
        {/* Top Meta & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span>메인 홈으로 이동</span>
          </button>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-secondary text-xs font-medium border border-border-subtle/50">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            Firebase 보안 가입
          </span>
        </div>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-full bg-primary-container/30 flex items-center justify-center text-primary shadow-sm border border-border-subtle">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight">
              회원가입
            </h1>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            Firebase 인증을 통해 안전하게 계정을 생성하고 맞춤형 학습을 시작하세요
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Signup Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full h-12 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 border border-slate-300"
          >
            {googleLoading ? (
              <svg className="animate-spin h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google 계정으로 빠른 가입</span>
              </>
            )}
          </button>
        </div>

        {/* Or Divider */}
        <div className="my-3 flex items-center gap-3">
          <div className="h-px bg-surface-container-high flex-1"></div>
          <span className="text-[11px] font-medium text-outline uppercase tracking-wider">
            또는 이메일로 가입
          </span>
          <div className="h-px bg-surface-container-high flex-1"></div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Name / Nickname */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between" htmlFor="name">
              <span>이름 / 닉네임</span>
              <span className="text-[11px] text-outline font-normal">상담 시 사용</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline-variant text-[20px] pointer-events-none">
                badge
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full h-11 bg-surface-container-low text-on-surface text-sm rounded-full pl-11 pr-5 placeholder:text-outline border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between" htmlFor="email">
              <span>이메일 주소</span>
              <span className="text-[11px] text-outline font-normal">로그인 아이디</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline-variant text-[20px] pointer-events-none">
                mail
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full h-11 bg-surface-container-low text-on-surface text-sm rounded-full pl-11 pr-5 placeholder:text-outline border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between" htmlFor="password">
              <span>비밀번호</span>
              <span className={`text-xs ${strength.color} font-medium`}>{strength.text}</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline-variant text-[20px] pointer-events-none">
                lock
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                minLength={8}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="영문, 숫자 포함 8자 이상"
                className="w-full h-11 bg-surface-container-low text-on-surface text-sm rounded-full pl-11 pr-12 placeholder:text-outline border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="비밀번호 표시 전환"
                className="absolute right-4 text-outline-variant hover:text-on-surface transition-colors focus:outline-none flex items-center justify-center p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

            {/* Password Strength Meter */}
            <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden mt-1 flex gap-1">
              <div
                className={`h-full w-1/3 rounded-full transition-colors duration-300 ${
                  strength.level >= 1
                    ? strength.level === 1
                      ? 'bg-status-danger'
                      : strength.level === 2
                      ? 'bg-secondary-container'
                      : 'bg-status-success'
                    : 'bg-outline-variant/30'
                }`}
              ></div>
              <div
                className={`h-full w-1/3 rounded-full transition-colors duration-300 ${
                  strength.level >= 2
                    ? strength.level === 2
                      ? 'bg-secondary-container'
                      : 'bg-status-success'
                    : 'bg-outline-variant/30'
                }`}
              ></div>
              <div
                className={`h-full w-1/3 rounded-full transition-colors duration-300 ${
                  strength.level >= 3 ? 'bg-status-success' : 'bg-outline-variant/30'
                }`}
              ></div>
            </div>
          </div>

          {/* Password Confirm */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-on-surface-variant flex items-center justify-between" htmlFor="password-confirm">
              <span>비밀번호 확인</span>
              {passwordsMatch && (
                <span className="text-xs text-status-success font-medium">일치함</span>
              )}
              {passwordsMismatch && (
                <span className="text-xs text-status-danger font-medium">불일치</span>
              )}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline-variant text-[20px] pointer-events-none">
                lock_clock
              </span>
              <input
                id="password-confirm"
                name="passwordConfirm"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 한 번 더 입력하세요"
                className="w-full h-11 bg-surface-container-low text-on-surface text-sm rounded-full pl-11 pr-12 placeholder:text-outline border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="비밀번호 확인 표시 전환"
                className="absolute right-4 text-outline-variant hover:text-on-surface transition-colors focus:outline-none flex items-center justify-center p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirmPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="relative flex items-start gap-2.5 cursor-pointer select-none group">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded bg-surface-container-high peer-checked:bg-primary-container flex items-center justify-center transition-all duration-200 group-hover:bg-surface-bright border border-border-subtle">
                  <span className="material-symbols-outlined text-white text-[13px] opacity-0 peer-checked:opacity-100 transition-opacity">
                    check
                  </span>
                </div>
              </div>
              <span className="text-xs text-on-surface-variant leading-snug">
                [필수]{' '}
                <span className="text-primary hover:underline underline-offset-4 cursor-pointer">
                  서비스 이용약관
                </span>{' '}
                및{' '}
                <span className="text-primary hover:underline underline-offset-4 cursor-pointer">
                  개인정보 처리방침
                </span>
                에 동의합니다.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-12 rounded-full bg-primary-container hover:bg-inverse-primary text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-200 active:scale-[0.98] mt-1 group cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
              </svg>
            ) : (
              <>
                <span>회원가입 완료</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Sign-in Alternative Link */}
        <div className="mt-6 pt-5 bg-surface-container-low/50 -mx-7 -mb-9 sm:-mx-9 sm:-mb-9 p-5 rounded-b-3xl flex flex-col items-center justify-center gap-2 border-t border-border-subtle/40">
          <div className="text-xs text-on-surface-variant text-center">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-primary hover:text-primary-fixed ml-1 font-semibold hover:underline underline-offset-4 transition-colors cursor-pointer"
            >
              로그인하기
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-outline text-[11px]">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>개인 맞춤형 상담 데이터는 Firebase Firestore에 안전하게 보관됩니다</span>
          </div>
        </div>
      </div>
    </div>
  );
};
