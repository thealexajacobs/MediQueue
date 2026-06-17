'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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

export function PrivacyMobileToC() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setTocOpen(!tocOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-border/20 bg-card/40 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/60"
      >
        On this page
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${tocOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {tocOpen && (
        <div className="mt-2 space-y-0.5 rounded-xl border border-border/20 bg-card/40 p-2">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setTocOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground/70 transition-colors hover:bg-muted/30 hover:text-foreground"
            >
              {section.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const TERMS_SECTIONS = [
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

export function TermsMobileToC() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setTocOpen(!tocOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-border/20 bg-card/40 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/60"
      >
        On this page
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${tocOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {tocOpen && (
        <div className="mt-2 space-y-0.5 rounded-xl border border-border/20 bg-card/40 p-2">
          {TERMS_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setTocOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground/70 transition-colors hover:bg-muted/30 hover:text-foreground"
            >
              {section.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
