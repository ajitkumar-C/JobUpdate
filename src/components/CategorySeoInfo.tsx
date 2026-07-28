import React from 'react';

interface CategorySeoInfoProps {
  categoryId: string;
}

export const CategorySeoInfo: React.FC<CategorySeoInfoProps> = ({ categoryId }) => {
  const cleanId = categoryId.toLowerCase();

  // 1. Latest Jobs
  if (cleanId.includes('job')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Latest Government Jobs (नवीनतम सरकारी नौकरी) — Online Recruitment Application Alerts</h3>
        <p>
          Welcome to the <strong>Latest Jobs</strong> portal of Sarkari Aavedan, your trusted resource for the most comprehensive and verified government job notifications in India. Securing a stable and prestigious career in the public sector (Sarkari Naukri) is highly sought after by millions of aspirants. We simplify this pursuit by listing all active recruitment drives across diverse central ministries and state administration departments in one easy-to-use directory.
        </p>
        <p>
          We constantly monitor and retrieve official notifications from all primary recruitment agencies. This includes the <strong>Union Public Service Commission (UPSC)</strong>, <strong>Staff Selection Commission (SSC)</strong>, <strong>Railway Recruitment Board (RRB)</strong>, <strong>Institute of Banking Personnel Selection (IBPS)</strong>, and prominent state-level services commissions such as <strong>UPPSC, BPSC, MPPSC, UKPSC, and DSSSB</strong>. Whether your educational qualification is 10th pass, 12th pass, graduate, or specialized technical degree, you can find matching job alerts here.
        </p>
        <p>
          Our job alerts are presented in a bilingual format (Hindi and English), detailing important dates, fee requirements, age criteria, and post breakdowns. In line with our commitment to transparency, all application buttons on our pages link directly to secure government portals (like upsc.gov.in and ssc.gov.in), bypassing advertisement redirection wrappers. Start exploring current openings and submit your online application form safely today.
        </p>
      </section>
    );
  }

  // 2. Result
  if (cleanId.includes('result')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Online Examination Results (परीक्षा परिणाम) — Sarkari Result, Selection Lists & Cut Offs</h3>
        <p>
          The <strong>Results</strong> page on Sarkari Aavedan delivers direct and secure access to competitive exam outcomes, official scorecards, and selection merit rosters. We understand the diligence and hard work that candidates put into preparation, which is why our automated system is designed to crawl official announcements continuously to display results as soon as they are made public.
        </p>
        <p>
          On this page, you can check scores and download merit rosters for major national and state tests, including **UPSC Civil Services, Staff Selection Commission (SSC CGL, CHSL, GD, CPO), Railway Recruitment Boards (RRB NTPC, Group D, ALP), IBPS Bank PO/Clerk**, and state services commissions. We do not host advertisement intermediate walls; clicking the download link retrieves the selection PDF directly from the official board servers.
        </p>
        <p>
          Alongside the selection lists, we publish detailed breakdowns of category-wise qualifying cut-off marks (General, OBC, EWS, SC, ST) and instructions for subsequent selection rounds, such as physical standards tests, typing tests, document verification, or counseling schedules.
        </p>
      </section>
    );
  }

  // 3. Admit Card
  if (cleanId.includes('admit') || cleanId.includes('card')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Exam Admit Cards (प्रवेश पत्र) — Download Hall Tickets & Exam Call Letters</h3>
        <p>
          Quickly download your **Admit Cards** and examination call letters on this page. The admit card (or hall ticket) is the single most critical document required to participate in any public sector competitive exam. It serves as your official entry pass to the testing center and contains your roll number, reporting times, exam shift details, and the precise address of your test venue.
        </p>
        <p>
          Our team monitors exam schedules to publish direct download links as soon as they are activated on the official testing servers. Find admit cards for key exams such as **SSC GD, UPSC Civil Services, RRB Technician, IBPS Bank Prelims/Mains, UGC NET, JEE, NEET**, and various state-level boards.
        </p>
        <p>
          To avoid server slowdowns close to the test date, we recommend downloading your call letters well in advance. Remember to verify the instructions printed on your hall ticket regarding allowed stationery items, acceptable government identity cards, and gate closing timings.
        </p>
      </section>
    );
  }

  // 4. Answer Key
  if (cleanId.includes('key')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Official Answer Keys (उत्तर कुंजी) — Download Solved Question Papers & OMR Sheets</h3>
        <p>
          The **Answer Keys** section helps you calculate approximate scores and check response sheets immediately after completing your exam. Accessing official answer keys and response sheets allows you to cross-examine your answers with the model answers prepared by the examination boards, giving you a realistic projection of your selection chances before the final results are declared.
        </p>
        <p>
          We index provisional keys, final solved keys, and question paper solutions for major examinations, including **Staff Selection Commission (SSC), Railway Recruitment Board (RRB), Teacher Eligibility Tests (CTET, UPTET, HTET)**, and state PCS exams.
        </p>
        <p>
          If you detect discrepancies or errors in the provisional answer keys, we also provide direct links and instructions on how to submit objections or challenge the answer keys on the official board portals before the specified deadline. Download the PDF key and analyze your marks today.
        </p>
      </section>
    );
  }

  // 5. Syllabus
  if (cleanId.includes('syllabus')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Exam Syllabus & Pattern (परीक्षा पाठ्यक्रम) — Download Official Syllabus PDF</h3>
        <p>
          Prepare methodically with our comprehensive **Syllabus** directory. Clear understanding of the examination pattern and subject-wise syllabus is crucial to structuring your revision plan and clearing competitive exams. We compile official, up-to-date syllabus documents and test patterns directly from the recruitment authorities.
        </p>
        <p>
          Our catalog includes detailed syllabus files for central exams like **UPSC IAS/IFS, SSC CGL/CHSL/GD, Railway ALP and Technicians, IBPS Bank Officers**, alongside various state-level recruitments.
        </p>
        <p>
          Each post syllabus guide is broken down into selection phases (Prelims, Mains, Interviews), written examination patterns (types of questions, time duration, negative marking scheme), and chapter-wise breakdowns for General Knowledge, Reasoning, Mathematics, English, and specialized optional subjects. Download the official PDF and start preparing today.
        </p>
      </section>
    );
  }

  // 6. Admission
  if (cleanId.includes('admission')) {
    return (
      <section className="seo-home-info no-print">
        <h3>School & College Admissions (प्रवेश परीक्षा आवेदन) — Course Online Forms & Entrance Exams</h3>
        <p>
          The **Admission** section on Sarkari Aavedan tracks entrance exams, course registrations, and counseling schedules for major educational institutions in India. Finding verified info on academic, technical, or professional admissions is essential for students taking the next step in their career.
        </p>
        <p>
          We cover online registration notifications and entrance test rules for prestigious schools and training programs, including **Jawahar Navodaya Vidyalayas (NVS), Central Universities Entrance Test (CUET), State Polytechnic diplomas, B.Ed training courses, ITI certificates, General Nursing & Midwifery (GNM), and B.Sc Nursing** courses.
        </p>
        <p>
          On each admission post, you can review age criteria, reservation guidelines, online application deadlines, and admission counseling parameters. Use our secure links to navigate directly to the institution portals and apply online.
        </p>
      </section>
    );
  }

  // 7. Outsourcing & Offline Jobs
  if (cleanId.includes('outsource') || cleanId.includes('offline')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Outsourcing & Contractual Vacancies (आउटसोर्सिंग एवं संविदा नौकरी) — Sewa Yojan Jobs</h3>
        <p>
          Find district-wise contractual and temporary job listings under our **Outsourcing and Offline Jobs** category. Many state government departments and local administrations hire auxiliary staff on a contract basis (Samvida Bharti) through registered service providers or local application forms.
        </p>
        <p>
          These postings include roles like data entry operators, drivers, office assistants, computer operators, sanitation staff, and technical supervisors. Outsource jobs offer quick employment and valuable public sector work experience.
        </p>
        <p>
          We list application submission deadlines, age criteria, salary package metrics, and direct links to register with official outsourcing platforms (such as the UP Sewa Sोजन portal). Browse local and offline vacancies in your area and submit your applications today.
        </p>
      </section>
    );
  }

  // 8. Certificate Verification
  if (cleanId.includes('certificate')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Certificate Verification (प्रमाण पत्र सत्यापन) — Verify Income, Domicile & Caste Online</h3>
        <p>
          Verify academic credentials and public certificates using our **Certificate Verification** section. Aspirants applying for reservation benefits, fee concessions, or scholarship disbursements are required to verify their government-issued identity certificates during documentation rounds.
        </p>
        <p>
          We provide clean, direct links to state-level verification portals where you can check the validity of your **Income Certificate (आय प्रमाण पत्र), Caste Certificate (जाति प्रमाण पत्र), Domicile Certificate (निवास प्रमाण पत्र), and EWS declarations**.
        </p>
        <p>
          Additionally, you can find direct verification links for state board results and school passing certificates to ensure all documents are ready for review during verification counseling.
        </p>
      </section>
    );
  }

  // 9. Important
  if (cleanId.includes('important')) {
    return (
      <section className="seo-home-info no-print">
        <h3>Important Citizen Services & Online Links (महत्वपूर्ण कड़ियां) — Public Utilities & Registration</h3>
        <p>
          The **Important** links directory contains vital public services, student utility forms, and national registration links. Searching through disparate government portals for basic services can be complex, so we compile these links into one accessible registry.
        </p>
        <p>
          Get direct access to **UP Scholarship online forms, One Time Registration (OTR) portals (UPSC/UPSSSC OTR), Aadhaar card updates, Voter ID registration, PAN card linking services, and driving license applications**.
        </p>
        <p>
          We ensure these directories link to active, official domains (such as uidai.gov.in and scholarship.up.gov.in) to provide a safe, direct user experience. Keep your civil documents up to date and apply for public utilities easily.
        </p>
      </section>
    );
  }

  return null;
};
