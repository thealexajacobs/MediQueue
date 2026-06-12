import { Spinner } from '@/components/ui/Spinner';

export default function AnalyticsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner label="Loading analytics..." />
    </div>
  );
}
