import React, { useState, useEffect } from 'react';
import { Page, UserProfile } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { MyPage } from './pages/MyPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { fetchUserProfile, saveUserProfile } from './lib/userService';

const DEFAULT_GUEST_USER: UserProfile = {
  name: '김서연',
  email: 'seoyeon.kim@example.com',
  role: '학생 회원',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuApUAMNzsTk57j_L6mIn_c0M5hJnMWasSv310CrU24wT8HYPCTb6v6vEyy-j1zuk9Oz8DIKYvyCwHUTG1_viTaaoKtKNJsVNKUmYs_L6IgyZYISryezMwQkMjbO0-IfsByGjw967hC4x2ETXla7-7I3Bjd15OgzTHEKP8HwcuulKDL4IcBvD9GmKBOGwG9zqN-ytTwsq4yXCa1ZHdit9Vq85U3tToi8PFjHBA-LHy6r5SvL0HYqKkd8',
  joinedDate: '2024년 3월 15일',
  daysActive: 342,
  consultationCount: 48,
  targetGoal: '인공지능 엔지니어링',
  coachingStyle: '주간 계획 코칭',
  studyCategory: 'cs',
  consultTone: 'mentor',
  notifyGoals: true,
  notifyReport: true,
  agreeDataTraining: false
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('chat-consultation');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('study_bot_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_GUEST_USER;
      }
    }
    return DEFAULT_GUEST_USER;
  });

  const [redirectAfterLogin, setRedirectAfterLogin] = useState<Page | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const profile = await fetchUserProfile(fbUser.uid);
          if (profile) {
            setUser(profile);
            localStorage.setItem('study_bot_user', JSON.stringify(profile));
          } else {
            // First time login profile setup
            const initialProfile: UserProfile = {
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || '학습자',
              email: fbUser.email || '',
              role: '학생 회원',
              avatarUrl:
                fbUser.photoURL ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuApUAMNzsTk57j_L6mIn_c0M5hJnMWasSv310CrU24wT8HYPCTb6v6vEyy-j1zuk9Oz8DIKYvyCwHUTG1_viTaaoKtKNJsVNKUmYs_L6IgyZYISryezMwQkMjbO0-IfsByGjw967hC4x2ETXla7-7I3Bjd15OgzTHEKP8HwcuulKDL4IcBvD9GmKBOGwG9zqN-ytTwsq4yXCa1ZHdit9Vq85U3tToi8PFjHBA-LHy6r5SvL0HYqKkd8',
              joinedDate: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
              daysActive: 1,
              consultationCount: 0,
              targetGoal: '인공지능 엔지니어링',
              coachingStyle: '주간 계획 코칭',
              studyCategory: 'cs',
              consultTone: 'mentor',
              notifyGoals: true,
              notifyReport: true,
              agreeDataTraining: false
            };
            await saveUserProfile(fbUser.uid, initialProfile);
            setUser(initialProfile);
            localStorage.setItem('study_bot_user', JSON.stringify(initialProfile));
          }
        } catch (error) {
          console.error('Error synchronizing user profile:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('study_bot_user', JSON.stringify(user));
  }, [user]);

  const isAuthenticated = Boolean(firebaseUser || user.uid);

  const handleNavigate = (page: Page) => {
    if (page === 'mypage' && !isAuthenticated) {
      setNoticeMessage('마이페이지는 로그인 후 이용하실 수 있습니다. 먼저 로그인해 주세요.');
      setRedirectAfterLogin('mypage');
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page !== 'login') {
      setNoticeMessage(null);
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    localStorage.setItem('study_bot_user', JSON.stringify(userProfile));
    const destination = redirectAfterLogin || 'mypage';
    setRedirectAfterLogin(null);
    setNoticeMessage(null);
    handleNavigate(destination);
  };

  const handleSignupSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    localStorage.setItem('study_bot_user', JSON.stringify(userProfile));
    const destination = redirectAfterLogin || 'chat-consultation';
    setRedirectAfterLogin(null);
    setNoticeMessage(null);
    handleNavigate(destination);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Signout warning:', err);
    }
    setFirebaseUser(null);
    setUser(DEFAULT_GUEST_USER);
    localStorage.removeItem('study_bot_user');
    setNoticeMessage(null);
    setRedirectAfterLogin(null);
    handleNavigate('home');
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'signup';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex flex-col antialiased selection:bg-primary-container selection:text-white">
      {/* Top Header - shown on main screens */}
      {!isAuthPage && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}

      {/* Main page content view */}
      <main className={`flex-1 w-full ${!isAuthPage ? 'pt-16' : ''}`}>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'chat-consultation' && <ChatPage user={user} />}
        {currentPage === 'mypage' && (
          isAuthenticated ? (
            <MyPage user={user} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />
          ) : (
            <LoginPage
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              noticeMessage={noticeMessage || '마이페이지는 로그인 후 이용하실 수 있습니다.'}
            />
          )
        )}
        {currentPage === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
            noticeMessage={noticeMessage}
          />
        )}
        {currentPage === 'signup' && (
          <SignupPage onNavigate={handleNavigate} onSignupSuccess={handleSignupSuccess} />
        )}
      </main>

      {/* Bottom Footer - shown on main screens */}
      {!isAuthPage && <Footer />}
    </div>
  );
}
