import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const legalDocs = {
  terms: {
    title: 'Terms & Conditions',
    effectiveDate: 'April 1, 2026',
    content: [
      {
        heading: 'Agreement to Terms',
        body: `These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and M&N Consulting LLC, the operator of ControlNode ("Company," "we," "our," or "us"). By accessing, browsing, or using ControlNode in any capacity, you acknowledge that you have read, understood, and agree to be bound by these Terms in their entirety. If you do not agree to these Terms, you must immediately discontinue use of the platform.`,
      },
      {
        heading: '1. Platform Use & Acceptable Conduct',
        body: `You agree to use ControlNode solely for lawful purposes and in accordance with these Terms. You shall not use the platform to engage in any activity that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable. You may not attempt to gain unauthorized access to any portion of the platform, its servers, or any systems connected to it. Automated scraping, data harvesting, or use of bots or similar tools without express written consent from M&N Consulting LLC is strictly prohibited. We reserve the right to terminate or restrict access to any user found to be in violation of these Terms at our sole discretion and without prior notice.`,
      },
      {
        heading: '2. No Financial, Investment, or Legal Advice',
        body: `All content, data, analysis, market intelligence, commentary, and materials provided through ControlNode are strictly for informational and educational purposes only. Nothing on this platform constitutes, nor should be interpreted as, financial advice, investment advice, trading recommendations, legal advice, tax guidance, or any other form of professional advisory service. ControlNode is a market intelligence and research aggregation tool. M&N Consulting LLC is not a registered investment advisor, broker-dealer, financial planner, or regulated financial institution of any kind. Any decisions you make regarding investments, trading, or financial matters based on information obtained from this platform are made entirely at your own risk and discretion. You should always consult with a qualified, licensed financial or legal professional before making any financial decision.`,
      },
      {
        heading: '3. Intellectual Property Rights',
        body: `All content on ControlNode — including but not limited to text, analysis, data visualizations, graphics, interface design, code, branding, the Morning Brief, the Domino Theory framework, and all proprietary methodologies — is the exclusive property of M&N Consulting LLC and is protected by applicable copyright, trademark, and intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the platform for personal, non-commercial purposes. You may not copy, reproduce, modify, distribute, publicly display, create derivative works from, or exploit any portion of ControlNode's content without express prior written consent from M&N Consulting LLC.`,
      },
      {
        heading: '4. User Accounts & Responsibility',
        body: `You are solely responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at clientcare@leadkast.com if you become aware of any unauthorized use of your account. M&N Consulting LLC shall not be liable for any losses resulting from unauthorized access to your account due to your failure to safeguard your credentials. All decisions, actions, or inactions taken as a result of information accessed through your account are your sole responsibility.`,
      },
      {
        heading: '5. Limitation of Liability',
        body: `To the fullest extent permitted by applicable law, M&N Consulting LLC, its officers, directors, employees, contractors, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages of any kind arising from or related to your use of, or inability to use, ControlNode. This includes, without limitation, damages for loss of profits, loss of data, loss of goodwill, business interruption, or any other financial or commercial losses. This limitation applies regardless of the legal theory under which damages are sought, even if M&N Consulting LLC has been advised of the possibility of such damages. In jurisdictions that do not allow the exclusion of certain warranties or limitations of liability, our liability shall be limited to the maximum extent permitted by law.`,
      },
      {
        heading: '6. Indemnification',
        body: `You agree to defend, indemnify, and hold harmless M&N Consulting LLC and its officers, directors, employees, contractors, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with: (a) your use of or access to ControlNode; (b) your violation of these Terms; (c) your violation of any third-party rights, including intellectual property rights; or (d) any claims made by third parties related to your use of the platform.`,
      },
      {
        heading: '7. Third-Party Content & Links',
        body: `ControlNode may display content sourced from third-party providers, news organizations, data vendors, and public sources. M&N Consulting LLC does not endorse, verify, or guarantee the accuracy, completeness, or reliability of any third-party content. Links to external websites are provided for informational purposes only and do not constitute an endorsement of those sites or their content. We are not responsible for the content, privacy practices, or terms of any third-party websites.`,
      },
      {
        heading: '8. Service Availability & Modifications',
        body: `M&N Consulting LLC does not guarantee that ControlNode will be available at all times or without interruption. We reserve the right to modify, suspend, or discontinue any aspect of the platform at any time without prior notice. We also reserve the right to update or modify these Terms at any time. Continued use of the platform following any changes constitutes your acceptance of the updated Terms. We encourage you to review these Terms periodically.`,
      },
      {
        heading: '9. Governing Law & Dispute Resolution',
        body: `These Terms shall be governed by and construed in accordance with the laws of the State of Tennessee, United States, without regard to its conflict of law provisions. Any disputes arising under or related to these Terms shall be resolved exclusively through binding arbitration in Tennessee, in accordance with the rules of the American Arbitration Association, unless otherwise agreed in writing by both parties. You waive any right to participate in a class action lawsuit or class-wide arbitration.`,
      },
      {
        heading: '10. Contact',
        body: `For questions regarding these Terms, contact us at: clientcare@leadkast.com\nM&N Consulting LLC — ControlNode`,
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    effectiveDate: 'April 1, 2026',
    content: [
      {
        heading: 'Our Commitment to Privacy',
        body: `M&N Consulting LLC ("ControlNode") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains what information we collect, how we use it, how we protect it, and your rights regarding your data. By using ControlNode, you consent to the data practices described in this policy.`,
      },
      {
        heading: '1. Information We Collect',
        body: `We may collect the following categories of information:\n\n• Account Information: Name, email address, and password when you register for an account.\n\n• Usage Data: Information about how you interact with the platform, including pages visited, features used, time spent, and navigation patterns.\n\n• Device & Technical Data: IP address, browser type, operating system, device identifiers, and referring URLs.\n\n• Payment Information: Billing details processed through our third-party payment processors. We do not store full payment card information on our servers.\n\n• User Preferences: Settings, notification preferences, and YouTube channels you choose to follow within the platform.\n\n• Communications: Any messages you send to us via email or support channels.`,
      },
      {
        heading: '2. How We Use Your Information',
        body: `We use collected information to:\n\n• Provide, maintain, and improve the ControlNode platform and its features.\n\n• Process payments and manage your subscription.\n\n• Personalize your experience, including displaying relevant content based on your preferences.\n\n• Send transactional emails such as account confirmations, billing receipts, and password resets.\n\n• Communicate platform updates, new features, or important notices.\n\n• Analyze usage patterns to improve platform performance and user experience.\n\n• Detect, prevent, and address technical issues, fraud, or security breaches.\n\n• Comply with legal obligations.`,
      },
      {
        heading: '3. Data Sharing & Third Parties',
        body: `M&N Consulting LLC does not sell, rent, or trade your personal information to third parties. We may share data in the following limited circumstances:\n\n• Service Providers: Trusted third-party vendors who assist in operating the platform (e.g., hosting, payment processing, analytics). These parties are contractually obligated to handle your data securely.\n\n• Legal Requirements: If required by law, regulation, court order, or government request.\n\n• Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction.\n\nWe require all third parties to maintain appropriate security standards when handling your data.`,
      },
      {
        heading: '4. Data Security',
        body: `We implement commercially reasonable technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. This includes encrypted connections (HTTPS), secure data storage, and access controls. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security and encourage you to use strong, unique passwords and keep your account credentials confidential.`,
      },
      {
        heading: '5. Data Retention',
        body: `We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us. We may retain certain information as required by law or for legitimate business purposes such as fraud prevention or dispute resolution.`,
      },
      {
        heading: '6. Your Rights',
        body: `Depending on your jurisdiction, you may have the following rights regarding your personal data:\n\n• Access: Request a copy of the personal data we hold about you.\n\n• Correction: Request correction of inaccurate or incomplete data.\n\n• Deletion: Request deletion of your personal data, subject to legal obligations.\n\n• Portability: Request transfer of your data in a machine-readable format.\n\n• Opt-Out: Opt out of marketing communications at any time.\n\nTo exercise any of these rights, contact us at clientcare@leadkast.com.`,
      },
      {
        heading: '7. Cookies',
        body: `We use cookies and similar tracking technologies. Please see our Cookies Policy for full details.`,
      },
      {
        heading: '8. Changes to This Policy',
        body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated effective date. Continued use of the platform constitutes acceptance of the revised policy.`,
      },
      {
        heading: '9. Contact',
        body: `Privacy questions or requests: clientcare@leadkast.com\nM&N Consulting LLC — ControlNode`,
      },
    ],
  },

  refund: {
    title: 'Refund Policy',
    effectiveDate: 'April 1, 2026',
    content: [
      {
        heading: 'Overview',
        body: `This Refund Policy governs all purchases made through ControlNode, operated by M&N Consulting LLC. Please read this policy carefully before subscribing to any plan or purchasing any service.`,
      },
      {
        heading: '1. All Sales Final',
        body: `Due to the immediate digital nature of ControlNode's services — including instant access to market intelligence data, analytics tools, the Morning Brief, and all platform features upon subscription — all purchases are considered final at the time of payment. We do not offer refunds as a standard policy for subscription fees already charged.`,
      },
      {
        heading: '2. Exceptions & Case-by-Case Review',
        body: `M&N Consulting LLC reserves the right to evaluate refund requests on a case-by-case basis at our sole discretion. Circumstances that may be considered include:\n\n• Technical issues on our end that prevented you from accessing the platform for an extended period.\n\n• Accidental duplicate charges.\n\n• Other extenuating circumstances deemed appropriate by management.\n\nRefund requests must be submitted within 7 days of the charge in question. Requests submitted after this window will not be considered.`,
      },
      {
        heading: '3. Promotional or Trial Offers',
        body: `If a specific product, service, or promotional offer includes a stated refund guarantee or trial period, those terms will be clearly disclosed at the time of purchase and will supersede this general policy for that specific offer only.`,
      },
      {
        heading: '4. Cancellations',
        body: `You may cancel your subscription at any time through your account settings or by contacting support. Cancellation stops future billing but does not entitle you to a refund for the current billing period already paid. You will retain access to the platform through the end of your paid billing period.`,
      },
      {
        heading: '5. How to Request a Review',
        body: `To submit a refund request for review, contact us at clientcare@leadkast.com with your account email, the date of the charge, and a description of your situation. We will respond within 5 business days.`,
      },
    ],
  },

  cookies: {
    title: 'Cookies Policy',
    effectiveDate: 'April 1, 2026',
    content: [
      {
        heading: 'Overview',
        body: `ControlNode, operated by M&N Consulting LLC, uses cookies and similar tracking technologies to provide and improve our platform experience. This policy explains what cookies are, how we use them, and your options for managing them.`,
      },
      {
        heading: '1. What Are Cookies',
        body: `Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to site operators. Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" (which remain on your device for a set period or until you delete them).`,
      },
      {
        heading: '2. Types of Cookies We Use',
        body: `• Essential Cookies: Required for the platform to function. These include authentication tokens that keep you logged in during your session. You cannot opt out of these without affecting platform functionality.\n\n• Performance & Analytics Cookies: Used to understand how users interact with ControlNode, which features are most used, and how to improve the platform. Data collected is aggregated and anonymized.\n\n• Preference Cookies: Store your platform settings such as notification preferences, watchlist configurations, and YouTube channel follows.\n\n• Third-Party Cookies: Some features may use third-party services (such as analytics providers) that set their own cookies. We do not control these cookies and encourage you to review the privacy policies of these providers.`,
      },
      {
        heading: '3. Why We Use Cookies',
        body: `We use cookies to:\n\n• Keep you securely logged in to your account.\n\n• Remember your preferences and settings across sessions.\n\n• Analyze platform usage to improve performance and user experience.\n\n• Detect and prevent security threats or fraudulent activity.\n\n• Enable certain platform features that require persistent state.`,
      },
      {
        heading: '4. Managing Your Cookie Preferences',
        body: `You have the right to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. Please note that disabling certain cookies may affect the functionality of ControlNode, including your ability to stay logged in or retain your preferences.\n\nFor instructions on managing cookies in your browser, visit your browser's help documentation. Common browsers include Chrome, Firefox, Safari, and Edge.`,
      },
      {
        heading: '5. Changes to This Policy',
        body: `We may update this Cookies Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the platform after changes constitutes acceptance.`,
      },
      {
        heading: '6. Contact',
        body: `Questions about our cookie practices: clientcare@leadkast.com`,
      },
    ],
  },

  disclaimer: {
    title: 'Disclaimer',
    effectiveDate: 'April 1, 2026',
    content: [
      {
        heading: 'Important — Please Read Carefully',
        body: `This Disclaimer applies to all content, data, analysis, market intelligence, commentary, and materials provided through ControlNode, operated by M&N Consulting LLC. By using this platform, you acknowledge and agree to the terms of this Disclaimer in full.`,
      },
      {
        heading: '1. Informational Purposes Only',
        body: `All information provided on ControlNode — including but not limited to market data, price analysis, technical reference levels, the Morning Brief, the Domino Theory framework, geopolitical observations, ETF flow data, media narratives, macro analysis, and any AI-generated summaries — is provided strictly for informational and educational purposes only.\n\nNothing on this platform constitutes financial advice, investment advice, trading recommendations, securities analysis, legal advice, tax guidance, or any other form of professional advisory service. No content on ControlNode should be construed as a recommendation or solicitation to buy, sell, or hold any financial instrument, cryptocurrency, security, or asset of any kind.`,
      },
      {
        heading: '2. Not a Registered Financial Institution',
        body: `M&N Consulting LLC and ControlNode are not registered investment advisors, broker-dealers, financial planners, securities dealers, commodity trading advisors, or regulated financial institutions of any kind under U.S. federal or state law, or under the laws of any other jurisdiction. We are a market intelligence and data aggregation platform. Nothing we publish creates a fiduciary duty or advisory relationship of any kind.`,
      },
      {
        heading: '3. No Guarantee of Accuracy',
        body: `While we make reasonable efforts to ensure the accuracy, completeness, and timeliness of the information provided, M&N Consulting LLC makes no representations or warranties of any kind — express or implied — regarding the accuracy, reliability, or completeness of any content on the platform. Market data, news, and analysis are inherently subject to change and may contain errors or omissions. Users should independently verify all information before making any decisions.`,
      },
      {
        heading: '4. User Responsibility',
        body: `All investment, trading, and financial decisions you make are entirely your own responsibility. You acknowledge that cryptocurrency and financial markets carry significant risk, including the potential for total loss of capital. You agree to conduct your own due diligence and consult with a qualified, licensed financial professional before making any financial decision. ControlNode shall not be responsible for any financial losses, missed opportunities, or damages arising from reliance on information provided through this platform.`,
      },
      {
        heading: '5. Technical Analysis Disclaimer',
        body: `Technical reference levels, chart patterns, RSI readings, and any other technical indicators displayed on ControlNode are observational data points only. They do not represent entry points, exit points, buy signals, sell signals, or targets of any kind. Technical analysis is inherently subjective and historical patterns do not guarantee future outcomes.`,
      },
      {
        heading: '6. Third-Party Content',
        body: `ControlNode aggregates and displays content from third-party news sources, data providers, and public information. M&N Consulting LLC does not endorse, verify, or guarantee the accuracy of third-party content. YouTube videos displayed through the YouTube Intel feature are created by independent content creators. ControlNode does not endorse the views, opinions, or recommendations expressed in any third-party content.\n\nThird-party content (including embedded videos) is provided for informational purposes only. ControlNode does not own or control this content. All rights to third-party content remain with their respective owners.`,
      },
      {
        heading: '7. Past Performance',
        body: `Any references to historical market performance, price movements, or correlation patterns are for contextual and educational purposes only. Past performance is not indicative of future results. Markets can and do behave in ways that contradict historical patterns.`,
      },
      {
        heading: '8. Limitation of Liability',
        body: `To the fullest extent permitted by applicable law, M&N Consulting LLC shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of or reliance upon ControlNode or any of its content. This includes, without limitation, financial losses of any kind.`,
      },
    ],
  },
}

export default function LegalModal({ doc, onClose }) {
  const data = legalDocs[doc]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!data) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col"
        style={{ background: '#161a22', border: '1px solid #1e2330' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid #1e2330' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
              {data.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>
              Effective Date: {data.effectiveDate} · M&N Consulting LLC
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: '#8892a4' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="space-y-6">
            {data.content.map((section, i) => (
              <div key={i}>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: '#3b82f6', fontFamily: 'Syne, sans-serif' }}
                >
                  {section.heading}
                </h3>
                <p
                  className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: '#8892a4' }}
                >
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-8 pt-4 text-center"
            style={{ borderTop: '1px solid #1e2330' }}
          >
            <p className="text-xs" style={{ color: '#374151' }}>
              M&N Consulting LLC · ControlNode · clientcare@leadkast.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { legalDocs }
