import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { TermsMobileToC } from '@/components/landing/MobileToC';

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'description', title: 'Description of Service' },
  { id: 'account-responsibilities', title: 'Account Responsibilities' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'patient-information', title: 'Patient Information' },
  { id: 'service-availability', title: 'Service Availability' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'limitation-of-liability', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'changes-to-terms', title: 'Changes to Terms' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'contact', title: 'Contact' },
];

export default function TermsPage() {
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
            <TermsMobileToC />
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
          Terms of{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Service
          </span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          The rules, responsibilities, and conditions governing the use of MediQueue.
        </p>
      </div>
    </section>
  );
}



function Content() {
  return (
    <div className="max-w-[720px]">
      <section id="acceptance" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Acceptance of Terms</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>
            By accessing or using MediQueue, you agree to be bound by these Terms of Service.
          </p>
          <p>
            If you do not agree with these terms, you may not use the service.
          </p>
        </div>
      </section>

      <Divider />

      <section id="description" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Description of Service</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>
            MediQueue provides a digital queue management platform that enables healthcare facilities to manage patient queues and provide real-time queue visibility.
          </p>
        </div>
        <p className="mt-6 text-sm font-semibold text-foreground/80">MediQueue is not:</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            'An electronic medical record system',
            'A diagnostic platform',
            'A prescription management system',
            'An insurance processing platform',
            'A telemedicine service',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 rounded-lg border border-border/10 bg-background/50 px-3.5 py-2.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section id="account-responsibilities" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Account Responsibilities</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          Users are responsible for:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            'Maintaining account security',
            'Protecting login credentials',
            'Ensuring information entered into the platform is accurate',
            'Complying with applicable laws and regulations',
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

      <section id="acceptable-use" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Acceptable Use</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          Users agree not to:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            'Misuse the platform',
            'Attempt unauthorized access',
            'Interfere with platform operations',
            'Upload malicious software',
            'Use the platform for unlawful activities',
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

      <section id="patient-information" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Patient Information</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>Facilities are responsible for ensuring they have appropriate authority to collect and manage patient information entered into MediQueue.</p>
          <p>Facilities should not store sensitive medical records within the platform.</p>
        </div>
      </section>

      <Divider />

      <section id="service-availability" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Service Availability</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>We strive to provide reliable service but do not guarantee uninterrupted availability.</p>
          <p>Temporary outages, maintenance, updates, or technical issues may occasionally affect access.</p>
        </div>
      </section>

      <Divider />

      <section id="intellectual-property" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Intellectual Property</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>All software, branding, content, and technology associated with MediQueue remain the property of MediQueue and its licensors.</p>
          <p>Users may not copy, modify, distribute, or reverse engineer the platform except as permitted by law.</p>
        </div>
      </section>

      <Divider />

      <section id="limitation-of-liability" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Limitation of Liability</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>To the maximum extent permitted by law, MediQueue shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from the use of the service.</p>
          <p>Use of the platform is at the user&apos;s own risk.</p>
        </div>
      </section>

      <Divider />

      <section id="termination" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Termination</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>We reserve the right to suspend or terminate accounts that violate these Terms of Service.</p>
          <p>Users may discontinue use of the service at any time.</p>
        </div>
      </section>

      <Divider />

      <section id="changes-to-terms" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Changes to Terms</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          <p>We may update these Terms of Service periodically.</p>
          <p>Continued use of MediQueue after updates constitutes acceptance of the revised terms.</p>
        </div>
      </section>

      <Divider />

      <section id="governing-law" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Governing Law</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          These Terms shall be governed by and interpreted in accordance with applicable laws of the jurisdiction in which MediQueue operates.
        </p>
      </section>

      <Divider />

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Contact</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
          For questions regarding these Terms, please contact:{' '}
          <a
            href="mailto:legal@mediqueue.com"
            className="text-primary underline underline-offset-4 decoration-primary/30 transition-all hover:decoration-primary"
          >
            legal@mediqueue.com
          </a>
        </p>
      </section>
    </div>
  );
}

function Divider() {
  return <div className="my-10 sm:my-12 h-px bg-border/30" />;
}


