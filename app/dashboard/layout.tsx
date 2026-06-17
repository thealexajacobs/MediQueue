import { Providers } from '@/components/Providers';
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <Providers>{children}</Providers>
    </SessionProviderWrapper>
  );
}
