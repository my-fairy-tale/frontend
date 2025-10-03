import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 md:p-8 my-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        개인정보 처리방침
      </h1>

      <p className="text-gray-700 leading-relaxed mb-8">
        나의 동화책(이하 &quot;회사&quot;)은 이용자의 개인정보를 중요시하며,
        「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」
        등 관련 법령을 준수하고 있습니다.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          1. 개인정보의 수집 항목 및 방법
        </h2>

        <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-700">
          수집하는 개인정보 항목
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>
            <strong>회원가입 시:</strong> 이메일 주소, 비밀번호, 이름, 전화번호
          </li>
          <li>
            <strong>서비스 이용 시:</strong> IP 주소, 쿠키, 접속 로그, 서비스
            이용 기록
          </li>
          <li>
            <strong>결제 시:</strong> 결제 정보, 거래 내역 (향후 유료 서비스
            제공 시)
          </li>
        </ul>

        <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-700">
          수집 방법
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>회원가입 및 서비스 이용 과정에서 이용자가 직접 입력</li>
          <li>자동 수집 도구를 통한 수집 (쿠키, 로그 분석)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          2. 개인정보의 수집 및 이용 목적
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>회원 관리:</strong> 회원제 서비스 제공, 본인 확인,
            불량회원의 부정 이용 방지
          </li>
          <li>
            <strong>서비스 제공:</strong> AI 동화책 생성, 콘텐츠 저장 및 관리,
            맞춤형 서비스 제공
          </li>
          <li>
            <strong>마케팅 및 광고:</strong> 신규 서비스 안내, 이벤트 정보 제공
            (동의한 경우에 한함)
          </li>
          <li>
            <strong>서비스 개선:</strong> 서비스 이용 통계 분석, 서비스 품질
            향상
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          3. 개인정보의 보유 및 이용 기간
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>회원 탈퇴 시:</strong> 지체 없이 파기 (단, 관련 법령에 따라
            보존이 필요한 경우 예외)
          </li>
          <li>
            <strong>법령에 따른 보존:</strong>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
              <li>
                대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)
              </li>
              <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
              <li>접속 로그 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          4. 개인정보의 제3자 제공
        </h2>
        <p className="text-gray-700 leading-relaxed">
          회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          다만, 다음의 경우에는 예외로 합니다.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
          <li>이용자가 사전에 동의한 경우</li>
          <li>
            법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에
            따라 수사기관의 요구가 있는 경우
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          5. 개인정보 처리 위탁
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고
          있습니다.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2">수탁업체</th>
                <th className="text-left py-2">위탁 업무 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2">AWS (Amazon Web Services)</td>
                <td className="py-2">서버 호스팅 및 데이터 저장</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2">OpenAI</td>
                <td className="py-2">AI 이미지 생성 서비스</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          * 위탁업체는 서비스 개선에 따라 변경될 수 있으며, 변경 시 공지사항을
          통해 안내드립니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          6. 이용자의 권리와 행사 방법
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>개인정보 열람 요구</li>
          <li>개인정보 정정 요구</li>
          <li>개인정보 삭제 요구</li>
          <li>개인정보 처리 정지 요구</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-3">
          권리 행사는 서비스 내 「마이페이지」 또는 「고객센터」를 통해
          가능하며, 회사는 지체 없이 조치하겠습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          7. 개인정보의 파기 절차 및 방법
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>파기 절차:</strong> 이용자가 입력한 정보는 목적 달성 후
            별도의 DB로 옮겨져 내부 방침 및 관련 법령에 따라 일정 기간 저장된 후
            파기됩니다.
          </li>
          <li>
            <strong>파기 방법:</strong>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
              <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          8. 개인정보 보호를 위한 기술적/관리적 대책
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>개인정보 암호화: 비밀번호는 암호화되어 저장 및 관리</li>
          <li>해킹 등에 대비한 기술적 대책: 방화벽, 백신 프로그램 운영</li>
          <li>
            개인정보 접근 제한: 개인정보를 처리하는 직원을 최소화하고 접근 권한
            관리
          </li>
          <li>개인정보 취급자 교육: 정기적인 보안 교육 실시</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          9. 쿠키의 운영 및 거부
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          회사는 이용자에게 최적화된 서비스를 제공하기 위해 쿠키를 사용합니다.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>쿠키란:</strong> 웹사이트를 운영하는데 이용되는 서버가
            이용자의 브라우저에 보내는 소량의 정보
          </li>
          <li>
            <strong>사용 목적:</strong> 로그인 세션 유지, 서비스 이용 편의성
            제공, 통계 분석
          </li>
          <li>
            <strong>거부 방법:</strong> 브라우저 설정에서 쿠키 저장을 거부할 수
            있습니다. 단, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이
            있을 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          10. 개인정보 보호책임자
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
          관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보
          보호책임자를 지정하고 있습니다.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">
            <strong>개인정보 보호책임자</strong>
          </p>
          <p className="text-gray-700">이름: 김재욱</p>
          <p className="text-gray-700">이메일: kjyook01@gmail.com</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          11. 개인정보 처리방침의 변경
        </h2>
        <p className="text-gray-700 leading-relaxed">
          본 개인정보 처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용이
          변경될 수 있으며, 변경 시 공지사항을 통해 안내드립니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          12. 권익침해 구제방법
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          개인정보 침해로 인한 신고나 상담이 필요하신 경우 아래 기관에 문의하실
          수 있습니다.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            개인정보 침해신고센터: (국번없이) 118{' '}
            <Link href="https://privacy.kisa.or.kr/main.do">
              (privacy.kisa.or.kr)
            </Link>
          </li>
          <li>
            개인정보 분쟁조정위원회: 1833-6972{' '}
            <Link href="http://www.kopico.go.kr/">(kopico.go.kr)</Link>
          </li>
          <li>
            대검찰청 사이버범죄수사단: (국번없이) 1301{' '}
            <Link href="https://www.spo.go.kr/site/spo/main.do">
              (spo.go.kr)
            </Link>
          </li>
          <li>
            경찰청 사이버안전국: (국번없이) 182{' '}
            <Link href="https://cyberbureau.police.go.kr/prevention/sub7.jsp?mid=020600">
              (cyberbureau.police.go.kr)
            </Link>
          </li>
        </ul>
      </section>

      <div className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">시행일자: 2025년 1월 1일</p>
        <p className="text-sm text-gray-600 mt-1">
          최근 변경일자: 2025년 1월 1일
        </p>
      </div>
    </main>
  );
}
