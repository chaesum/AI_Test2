import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openTerms = (title: string, body: string) => {
    setModalContent({ title, body });
  };

  return (
    <>
      <footer className="w-full bg-surface-container-low mt-auto border-t border-border-subtle/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-headline-sm text-lg font-semibold text-on-surface">학습 상담 챗봇</span>
            <p className="font-body-sm text-sm text-on-surface-variant">
              맞춤형 인공지능 기반 자기주도 학습 및 진로 상담 파트너
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-on-surface-variant">
            <button
              onClick={() =>
                openTerms(
                  '서비스 이용약관',
                  '제1조 (목적) 본 약관은 학습 상담 챗봇 서비스(이하 "서비스")가 제공하는 인공지능 기반 학습 진단, 스케줄링 및 멘토링 서비스의 이용 조건 및 절차에 관한 제반 사항을 규정함을 목적으로 합니다.\n\n제2조 (이용자의 의무) 이용자는 학업 고민, 진로 계획 등 건전한 목적에 한하여 서비스를 이용하며, 타인의 권리를 침해하거나 서비스의 안정적 운영을 저해하는 행위를 하지 않습니다.\n\n제3조 (지적재산권) 상담을 통해 생성된 개인 맞춤형 리포트 및 타임라인은 학습자 본인의 자기주도 학습 증진을 위해 자유롭게 열람 및 활용할 수 있습니다.'
                )
              }
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              이용약관
            </button>
            <button
              onClick={() =>
                openTerms(
                  '개인정보처리방침',
                  '1. 개인정보의 처리 목적: 회원의 학습 성향 분석, 일대일 챗봇 상담 세션 유지, 학습 리포트 제공 및 서비스 품질 향상.\n\n2. 수집하는 개인정보 항목: 이름/닉네임, 이메일 주소, 상담 질문 내역, 관심 학습 분야 및 코칭 선호도.\n\n3. 개인정보의 안전성 확보 조치: 모든 대화 및 계정 정보는 256비트 종단간 암호화(End-to-End Encryption) 프로토콜을 적용하여 안전하게 관리되며, 회원 탈퇴 시 지체 없이 영구 파기됩니다.'
                )
              }
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              개인정보처리방침
            </button>
            <button
              onClick={() =>
                openTerms(
                  '고객지원 및 문의',
                  '학습 상담 챗봇 지원팀에 문의사항이 있으시면 언제든지 아래 안내를 참고해 주세요.\n\n• 이메일 지원: support@learnbot.example.com\n• 운영 시간: 평일 09:00 ~ 18:00 (주말 및 공휴일 휴무)\n• 실시간 챗봇 상담: 24시간 365일 상시 지원\n\n학습 환경이나 서비스 버그 관련 제보는 마이페이지 내 피드백을 통해서도 접수 가능합니다.'
                )
              }
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              고객지원
            </button>
          </div>

          <p className="font-label-sm text-xs text-on-surface-variant">
            © 2025 학습 상담 챗봇 서비스. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Info Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border-prominent w-full max-w-lg rounded-2xl p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container-high">
              <h3 className="font-headline-sm text-lg font-semibold text-on-surface">
                {modalContent.title}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-body-sm text-sm text-on-surface-variant whitespace-pre-line leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {modalContent.body}
            </div>
            <div className="mt-6 pt-3 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-medium text-sm transition-all cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
