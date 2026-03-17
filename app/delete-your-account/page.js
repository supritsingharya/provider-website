'use client';
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

export default function DeleteAccountPage() {
    return (
        <div className={`${inter.variable} ${lexend.variable}`}>
            <Head>
                <title>Delete Your Account - Dream Provider Private Limited</title>
                <meta name="description" content="Instructions on how to delete your account and data from Dream Provider." />
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
                                    <span className="ml-1 font-sans text-gray-200">Delete Account</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <h1 className="font-heading bg-gradient-to-br from-white to-violet-300 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                        Delete Your Account
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto font-sans text-lg text-gray-300">
                        We respect your right to control your data. Below are structural instructions on how to request the deletion of your account and personal information.
                    </p>
                </div>
            </header>

            {/* --- Main Content --- */}
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
              .prose p, .prose ul, .prose ol {
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

                        <h2>Introduction</h2>
                        <p>
                            At Dream Provider Private Limited, we value your privacy and are committed to giving you control over your personal information. If you wish to discontinue using our services and remove your data from our systems, you have the right to request the deletion of your account.
                        </p>

                        <h2>How to Request Account Deletion</h2>
                        <p>
                            Currently, you can request the deletion of your account by contacting our support team directly. Please follow the steps below:
                        </p>
                        <ol>
                            <li>Compose an email to <a href="mailto:providerteam.in@gmail.com">providerteam.in@gmail.com</a>.</li>
                            <li>Use the subject line: <strong>Delete My Account - [Your Registered Email/Phone Number]</strong>.</li>
                            <li>In the body of the email, please explicitly state your request to delete your account and remove your personal data.</li>
                            <li>Please send the email from the email address associated with your account (if applicable) or provide sufficient details for us to verify your identity.</li>
                        </ol>
                        <p>
                            Our support team will process your request within <strong>7-14 business days</strong>. We may contact you for further verification to ensure the security of your account before proceeding with the deletion.
                        </p>

                        <h2>Data Deletion and Retention</h2>
                        <h3>What will be deleted?</h3>
                        <ul>
                            <li><strong>Profile Information:</strong> Your name, email address, phone number, and profile pictures.</li>
                            <li><strong>User Generated Content:</strong> Any listings, posts, or comments you have created on our platform.</li>
                            <li><strong>Saved Data:</strong> Your saved preferences, favorites, and search history.</li>
                        </ul>

                        <h3>What information may be retained?</h3>
                        <p>
                            In some cases, we are required to retain certain information for legal, security, or accounting purposes, even after you delete your account. This may include:
                        </p>
                        <ul>
                            <li><strong>Transaction Records:</strong> History of payments or bookings for financial auditing and tax compliance.</li>
                            <li><strong>Legal Obligations:</strong> Data that we are legally required to keep to comply with applicable laws and regulations.</li>
                            <li><strong>Security Logs:</strong> Information needed to prevent fraud, abuse, and ensure the security of our platform.</li>
                        </ul>
                        <p>
                            Any retained data will be securely stored and isolated from further processing to the extent possible.
                        </p>

                        <h2>Contact Us</h2>
                        <p>
                            If you have any questions or need assistance with the account deletion process, please do not hesitate to contact us at:
                        </p>
                        <p>
                            <strong>Email:</strong> <a href="mailto:providerteam.in@gmail.com">providerteam.in@gmail.com</a><br />
                            <strong>Address:</strong> Rudhauli, Rudranagar, Basti, Uttar Pradesh 272151
                        </p>

                    </div>
                </div>
            </main>
        </div>
    );
}
