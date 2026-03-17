// app/privacy/page.js
'use client'
import Head from 'next/head';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { Inter, Lexend } from 'next/font/google';
import PrivacyAnimation from '../components/PrivacyAnimation';

// --- Font Configuration ---
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-lexend',
});

// --- SVG Noise Filter for Texture ---
const NoiseTexture = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" opacity="0.15"></rect>
  </svg>
);

export default function PrivacyPolicyPage() {
  return (
    <div className={`${inter.variable} ${lexend.variable}`}>
      <Head>
        <title>Privacy Policy - Dream Provider Private Limited</title>
        <meta name="description" content="Our commitment to your privacy. Learn how we collect, use, and protect your data." />
      </Head>

      {/* --- Immersive Header with Gradient, Texture, and Animation --- */}
      <header className="relative overflow-hidden bg-slate-950 pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-slate-950"></div>
        <NoiseTexture />
        <div className="absolute inset-x-0 top-0 h-full">
          <PrivacyAnimation />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <nav className="mb-8 flex justify-center">
            <ol className="inline-flex items-center space-x-1 text-sm text-gray-400">
              <li>
                <Link href="/" className="font-sans hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="h-4 w-4" />
                  <span className="ml-1 font-sans text-gray-200">Privacy Policy</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <h1 className="font-heading bg-gradient-to-br from-white to-violet-300 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl mx-auto font-sans text-lg text-gray-300">
            Your trust is our priority. This policy outlines how we collect, use, and safeguard your personal information.
          </p>
        </div>
      </header>

      {/* --- Main Content with Enhanced Spacing and Full Text --- */}
      <main className="bg-white pb-24 pt-16">
        <div className="container mx-auto px-6">
          <div className="prose prose-xl max-w-4xl mx-auto">
            <style jsx global>{`
              :root {
                --tw-prose-body: #374151;
                --tw-prose-headings: #1e293b;
                --tw-prose-links: #4f46e5;
                --tw-prose-bold: #1e293b;
              }
              .prose p, .prose ul {
                font-family: ${inter.style.fontFamily};
                line-height: 1.75;
              }
              .prose h1, .prose h2, .prose h3 {
                font-family: ${lexend.style.fontFamily};
                font-weight: 700;
              }
              .prose h2 {
                margin-top: 2.5em;
                margin-bottom: 1.25em;
                padding-bottom: 0.5em;
                border-bottom: 1px solid #e5e7eb;
              }
              .prose h3 {
                margin-top: 2em;
                margin-bottom: 1em;
              }
              .prose a {
                transition: color 0.2s ease-in-out;
              }
              .prose a:hover {
                color: #312e81;
              }
            `}</style>

            {/* START OF FULL PRIVACY POLICY TEXT */}
            <p>This Privacy Policy explains how Dream Provider Private Limited and its affiliates collect (dreamprovider.in), use, and share information from or about you when you use our websites, downloadable applications such as interactive mobile applications, and voice-activated assistants, and other services that link to this policy (hereinafter referred to as Services). When you use the Services, you agree to the collection, use, and sharing of your information as described in this Privacy Policy. Before you submit any information, please read this Privacy Policy for an explanation of how we will treat your personal information.</p>
            <p>By using any part of the services, you consent to the collection, use, disclosure, and transfer of your personal information for the purposes outlined in this Privacy Policy and to the collection, processing, and maintenance of this information. If you do not agree to this Privacy Policy, please do not use the Portal. Your use of any part of the Portal indicates your acceptance of this Privacy Policy and of the collection, use, and disclosure of your personal information in accordance with this Privacy Policy. While you have the option not to provide us with certain information or withdraw consent to collect certain information, kindly note that in such an event you may not be able to take full advantage of the entire scope of features and services offered to you and we reserve the right not to provide you with our services.</p>

            <h2>1. TYPES OF INFORMATION WE COLLECT</h2>
            <h3>Information You Provide to Us</h3>
            <ul>
                <li><strong>Contact and registration information:</strong> such as your name, address, telephone number, email address, username, and password.</li>
                <li><strong>Information about you or your friends and family:</strong> such as demographic or biographical information, gender, interests, photos, or any other information about you that you provide to us, including information about friends, contacts, or referrals.</li>
                <li><strong>Transaction information:</strong> payment information such as your credit/debit card details, purchase history, and other information related to your transaction.</li>
                <li><strong>Customer care, technical support, and other feedback:</strong> questions and other messages you address to us directly through online forms and social media platforms. If you contact us by phone, we may record the conversation and/or keep a summary of the call.</li>
                <li><strong>Other information you provide:</strong> any other information that you provide to us, including posts, date of birth, content, photos, booking times, or biometric identifiers such as facial scans or fingerprints.</li>
            </ul>

            <h3>Information We Collect Automatically</h3>
            <ul>
                <li><strong>Device Information:</strong> including your IP address, browser types, browser language, operating system, platform type, device types, and device IDs such as unique identifiers, advertising identifiers, etc.</li>
                <li><strong>Usage Information:</strong> including files you download, domain names, landing pages, your browsing activity, what you click, scrolling and keystroke activity, pages viewed, advertising viewed or visited, forms or fields you complete or partially complete, search terms, whether you open an email and your interaction with the content, access times, and error logs, and other similar information.</li>
                <li><strong>Location Information:</strong> including the city, state, and ZIP code associated with your IP address, information derived through WiFi triangulation, and precise location information from GPS-based functionality on your mobile devices or from your use of our Mobile Apps, and with your consent, your precise GPS information.</li>
                <li><strong>Offline Information:</strong> Certain information may also be stored while you are offline and transmitted to us when you next connect to the Internet, regardless of where you connect from or the device you use to connect.</li>
            </ul>

            <h3>Information from Third Party Sources</h3>
            <p>We may receive information about you from third parties, partners, or our service providers, such as:</p>
            <p>Public Information: from publicly and commercially available online or offline sources, as permitted by law, including demographic information, purchasing data, membership in loyalty programs, or information about advertisements you have seen or acted upon, including your interaction with advertisers’ products and services.<br />
            Social Media Information: if you visit the website on a device on which you also use social networks or if you interact with us through a social media service or other platforms, we may have access to some information you provide to that social network or platform, such as your name, email address, friend list, photo, age, gender, location, birthday, social networking ID, current city, and the people/sites you follow.</p>

            <h2>2. HOW WE USE YOUR INFORMATION</h2>
            <p>Depending on the Service you use, we, or our service providers, may use your information to:</p>
            <h3>Provide the Service including</h3>
            <ul>
                <li>Responding to your requests or inquiries;</li>
                <li>Providing technical support;</li>
                <li>Sending you service-related communications, including announcements and administrative messages;</li>
                <li>Understanding how you use the services so we can improve them.</li>
            </ul>
            <h3>Personalize your experience including</h3>
            <ul>
                <li>Providing you with advertising based on your activities and interests;</li>
                <li>Creating and updating audience segments that can be used for targeted advertising and marketing on the services, television, third-party services and platforms, mobile apps and/or websites, and offline;</li>
                <li>Creating profiles about you, including adding information we obtain from third parties, which may be used for analytics, marketing, and advertising;</li>
                <li>Sending you newsletters, surveys and information about products, services and promotions offered by us, our partners, and other organizations with which we work.</li>
            </ul>
            <h3>Recognize your devices and associate the information with your profile including</h3>
            <ul>
                <li>Using data collected or received from service providers, advertisers, and other third parties, such as your device information, to match mobile advertising and cookie identifiers;</li>
                <li>Matching your devices if you log into the same online service on multiple devices or web browsers or if your devices share similar attributes that support an inference that they are used by the same user or household;</li>
                <li>Using this information to match your interests across devices, as well as for analytics, ad serving or reporting, or to improve the services;</li>
                <li>Identifying you or your device or associated information with you, your device, or your profile whenever you use the service, even if you do so when logged out or without intentionally identifying yourself.</li>
            </ul>
            <h3>Prevent fraud and defend our legal rights</h3>
            <ul>
                <li>Protecting the safety of our users and others;</li>
                <li>Enforcing our terms of service;</li>
                <li>Preventing fraud or any other potentially illegal activities.</li>
            </ul>
            <p>We may combine all the information we collect from or receive about you for any of the foregoing purposes. Please see Your Rights and Choices section for further information. We may aggregate or de-identify your information and may use, share, rent, or sell aggregated or de-identified information for any purpose and such information is not subject to this Privacy Policy.</p>

            <h2>3. HOW WE SHARE YOUR INFORMATION</h2>
            <p>We may share your information with:</p>
            <ul>
                <li><strong>Service providers that perform certain business-related functions on our behalf:</strong> including research and analytics, website hosting, transaction fulfillment, payment, processing database maintenance, contest, sweepstakes and promotion administration, fraud prevention, technology services and platforms, identity management and acquisition and conversion services.</li>
                <li><strong>Advertisers, Advertising Networks, and Other Third Parties:</strong> information about how you use the Services and interact with content or ads to better tailor services, products, marketing, and advertising on our service or on third-party platforms. These third parties may use their own tracking technologies/cookies to collect or request information about you, including through surveys.</li>
                <li><strong>Hashed/Masked Information:</strong> We may share information about you along with a hashed or masked identifier, with third parties so they may better personalize your experience with them and the offers they send you.</li>
                <li><strong>Social Networks:</strong> certain features in our services may be published to your social networks. For example, if you click on a Facebook “like” button on a Service, the “like” may appear on your Facebook account. To control this sharing of information, please review the relevant social network’s privacy policy.</li>
                <li><strong>Other Users and Search Engines:</strong> depending on the service, you may provide certain information including your name, photo, and other information to create an account (“Account Profile”). Some information in your Account Profile may be available publicly to other members of that service, or the general public, and may be searchable by search engines. When we display your user submissions, they will be identified by information in your Account Profile. We may distribute user submissions to third parties, and if we do, we may include any information in your Account Profile or submissions.</li>
                <li><strong>Law Enforcement Agencies, Regulators, Content Protection Organizations, Anti-fraud Coalitions and other groups to:</strong>
                    <ul>
                        <li>protect our legal rights, privacy or safety, and that of our Affiliates, our employees, agents, contractors, or other individuals;</li>
                        <li>protect the safety and security of visitors to the services or other properties;</li>
                        <li>protect against fraud or other illegal activity or for risk management purposes;</li>
                        <li>respond to inquiries or requests from government, regulatory, law enforcement, or public authorities;</li>
                        <li>permit us to pursue available remedies, commence, participate in, or defend litigation, or limit the damages that we may sustain;</li>
                        <li>comply with the law including with summons, search warrants, court orders, and other legal processes;</li>
                        <li>enforce applicable terms of service.</li>
                    </ul>
                </li>
            </ul>

            <h2>4. YOUR RIGHTS AND CHOICES</h2>
            <h3>Communication Preferences and Opt-outs</h3>
            <p>You may unsubscribe from our email newsletters or promotional emails by following the opt-out instructions contained in the email. You cannot unsubscribe from service-related, transactional, or emails related to your service.</p>
            <h3>Rectification or Erasure of Information</h3>
            <p>Users are entitled to contact us at [] to request for rectification of the Personal Information collected by us and/or for erasure of your Personal Information.</p>
            <h3>Withdrawal of Consent</h3>
            <p>If you have given your free consent to the collection, use, disclosure, retention and protection of your Personal Information, and wish to withdraw such consent, you may do so by contacting us at [] at any time.</p>
            <p>Notwithstanding the above provisions, any decision by you to opt-out, rectify or erase information from our records or withdraw your consent shall not in any manner whatsoever affect and/or make illegal processing of your information done prior to the communication of your aforesaid decision to us.</p>
            <h3>Cookies and Similar Technologies</h3>
            <p>We, and our service providers, advertisers, and other partners, use cookies and similar technologies (e.g., web beacons, pixels, ad tags and device identifiers) to recognize you and/or your device(s) on, off and across different services and devices. Our Cookies and Tracking Technologies policy provides certain opt-out choices. However, we may still allow collect usage data for certain other purposes (e.g., contextual advertising, research, analytics, and internal operations).</p>
            <h3>Other Online Services</h3>
            <p>Our services may contain links to third party websites and services. These other sites may collect information about you when you visit them and use this information in accordance with their own privacy policies and terms of use. We do not endorse or control those third parties’ policies or practices. In some circumstances, we may host some websites on behalf of others and those entities may place or permit the placement of cookies and other tracking technology. We are not responsible for these tracking practices.</p>

            <h2>5. HOW WE PROTECT YOUR INFORMATION</h2>
            <p>We maintain procedural, technical, and physical safeguards for the services to help protect against loss, misuse or unauthorized access, disclosure, alteration, or destruction of the information you provide via the services. These safeguards vary depending upon the sensitivity of the information we collect and store. Please be aware that no security solutions are infallible. The database is stored on servers secured behind a firewall; access to such servers being password-protected and strictly limited based on need-to-know basis, we cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet. Further, any information you include in a posting to the discussion areas will be available to anyone with Internet access. By using the Portal, you understand and agree that your information may be used in or transferred to countries other than India.</p>

            <h2>6. UPDATES TO OUR PRIVACY POLICY</h2>
            <p>If we make material changes to the way we collect or use your information, we will notify you by posting a revised version of this Privacy Policy online, and we may also notify you by other means. You should check the website periodically for updates.</p>
            <p>The date at the top of the Privacy Policy tells you when it was last updated. Any changes to this Privacy Policy will become effective when the revised Privacy Policy is posted. If you use this online service after the changes are posted, you have agreed the changes. If you do not agree with this Privacy Policy or any changes we make, please do not continue to use the Services.</p>

            <h2>7. Privacy Policy Update: Collection of Phone Numbers</h2>
            <h3>Introduction</h3>
            <p>Dream Provider Private Limited is committed to protecting the privacy and security of our users' personal information. This section of our Privacy Policy provides detailed information about how and why we collect, use, protect, and share phone numbers.</p>
            <h3>Collection of Phone Numbers</h3>
            <p>We collect phone numbers from our users for the following purposes:</p>
            <ul>
                <li>Account verification: To ensure the security of user accounts and prevent unauthorized access.</li>
                <li>Customer support: To facilitate communication with users and provide assistance when needed.</li>
                <li>Sending important updates: To keep users informed about essential service-related information.</li>
            </ul>
            <p>The collection of phone numbers occurs during the account registration process, and providing this information is voluntary. However, not providing a phone number may limit the use of certain features/services.</p>
            <h3>Use of Collected Phone Numbers</h3>
            <p>The phone numbers collected are used exclusively for the following purposes:</p>
            <ul>
                <li>Account verification and security checks: To prevent unauthorized access and ensure the security of user accounts.</li>
                <li>Communication with users: For providing support, service updates, and promotional offers, if consented to by the user.</li>
                <li>Enhancing our services: Based on user feedback to improve the overall user experience.</li>
            </ul>
            <h3>Protection of Phone Numbers</h3>
            <p>We implement robust security measures to protect the phone numbers and other personal information of our users. These measures include encryption, access controls, and secure storage. We regularly review our security policies and update them as necessary to ensure the highest level of protection.</p>
            <h3>Sharing of Phone Numbers</h3>
            <p>Dream Provider Private Limited does not share phone numbers with third parties without user consent, except in the following circumstances:</p>
            <ul>
                <li>To comply with legal obligations or respond to legal proceedings (e.g., a court order).</li>
                <li>To protect the rights, property, or safety of Dream Provider Private Limited, our users, or the public.</li>
                <li>With service providers acting on our behalf who have agreed to handle the information confidentially and securely (Specify types of service providers, if applicable).</li>
            </ul>
            <h3>Users' Rights</h3>
            <p>Users have the right to access, correct, delete, or limit the use of their phone numbers and other personal data. Users can exercise these rights by contacting our support team or accessing their account settings.</p>
            <p>For more information on how we handle personal information, please refer to our full <a href="#link-to-full-policy">Privacy Policy</a>.</p>

            <h2>8. CONTACT US</h2>
            <p>For any questions or complaints about this Privacy Policy or our privacy practices, please contact us at <a href="mailto:providerteam.in@gmail.com">providerteam.in@gmail.com</a>.</p>
            <p>Office address - Rudhauli, Rudranagar, Basti, Uttar Pradesh 272151.</p>
            {/* END OF FULL PRIVACY POLICY TEXT */}
            
          </div>
        </div>
      </main>
    </div>
  );
}