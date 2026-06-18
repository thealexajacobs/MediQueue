import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { PrivacyMobileToC } from '@/components/landing/MobileToC';

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use-information', title: 'How We Use Information' },
  { id: 'patient-data', title: 'Patient Data' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'third-party-services', title: 'Third-Party Services' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'changes-to-this-policy', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact' },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back<span className="hidden sm:inline"> to Dashboard</span>
          </Link>
        </div>
        <Hero />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:pb-32">
          <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-12 xl:gap-16">
            <nav className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
                  On this page
                </p>
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground/70 transition-colors hover:bg-muted/30 hover:text-foreground"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </nav>
            <PrivacyMobileToC />
            <Content />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-8 sm:pb-12 sm:pt-12 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 bg-gradient-to-t from-primary/[0.03] to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Last Updated: June 2026
        </div>
        <h1 className="text-[clamp(2rem,_1.5rem_+_3vw,_3.5rem)] font-bold leading-[1.1] tracking-tight text-foreground">
          Privacy{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          How we collect, use, and protect information within MediQueue.
        </p>
      </div>
    </section>
  );
}



function Content() {
  return (
    <div className="max-w-[720px]">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Introduction</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>
            MediQueue (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) provides a queue management platform
            that helps healthcare facilities manage patient flow and provide real-time queue visibility.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, and protect information when you use MediQueue.
          </p>
          <p>
            By using MediQueue, you agree to the practices described in this policy.
          </p>
        </div>
      </section>

      <Divider />

      <section id="information-we-collect" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Information We Collect</h2>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Account Information</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">When a facility creates an account, we may collect:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {['Name', 'Email address', 'Facility name', 'Login credentials'].map((item) => (
                <li key={item} className="flex items-start gap-2.5 rounded-lg border border-border/10 bg-background/50 px-3.5 py-2.5">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Queue Information</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">To operate the service, facilities may enter:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {['Patient names', 'Optional patient phone numbers', 'Queue assignments', 'Queue activity records'].map((item) => (
                <li key={item} className="flex items-start gap-2.5 rounded-lg border border-border/10 bg-background/50 px-3.5 py-2.5">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Usage Information</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">We may automatically collect:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {['Device information', 'Browser information', 'IP address', 'Log data', 'Usage analytics'].map((item) => (
                <li key={item} className="flex items-start gap-2.5 rounded-lg border border-border/10 bg-background/50 px-3.5 py-2.5">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Divider />

      <section id="how-we-use-information" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">How We Use Information</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          We use the information we collect to:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            'Provide queue management services',
            'Generate queue tracking links',
            'Improve platform performance',
            'Maintain security',
            'Monitor system reliability',
            'Provide customer support',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-lg border border-border/10 bg-background/50 px-3.5 py-2.5">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      <section id="patient-data" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Patient Data</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>MediQueue is a queue management platform.</p>
          <p>
            Facilities should not store medical diagnoses, treatment information, prescriptions, insurance details,
            or other sensitive medical records within the platform.
          </p>
          <p>
            Patients access queue information through unique tracking links or QR codes.
          </p>
        </div>
      </section>

      <Divider />

      <section id="data-security" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Data Security</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>
            We implement reasonable technical and organizational measures to protect information from unauthorized
            access, disclosure, or misuse.
          </p>
          <p>
            While we strive to protect data, no method of electronic storage or transmission is completely secure.
          </p>
        </div>
      </section>

      <Divider />

      <section id="data-retention" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Data Retention</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          We retain information only as long as necessary to provide services, comply with legal obligations,
          resolve disputes, and enforce agreements.
        </p>
      </section>

      <Divider />

      <section id="third-party-services" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Third-Party Services</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>MediQueue may use trusted third-party providers for hosting, analytics, authentication, and infrastructure services.</p>
          <p>These providers may process information on our behalf.</p>
        </div>
      </section>

      <Divider />

      <section id="your-rights" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Your Rights</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          Depending on your location, you may have rights to:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            'Access your information',
            'Correct inaccurate information',
            'Request deletion of information',
            'Object to certain processing activities',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-lg border border-border/10 bg-background/50 px-3.5 py-2.5">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          Requests may be submitted through our contact channels.
        </p>
      </section>

      <Divider />

      <section id="changes-to-this-policy" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Changes to This Policy</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>We may update this Privacy Policy from time to time.</p>
          <p>Updates will be posted on this page with a revised effective date.</p>
        </div>
      </section>

      <Divider />

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Contact</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          For privacy-related questions, please contact:{' '}
          <a
            href="mailto:privacy@mediqueue.com"
            className="text-primary underline underline-offset-4 decoration-primary/30 transition-all hover:decoration-primary"
          >
            privacy@mediqueue.com
          </a>
        </p>
      </section>
    </div>
  );
}

function Divider() {
  return <div className="my-10 sm:my-12 h-px bg-border/30" />;
}


