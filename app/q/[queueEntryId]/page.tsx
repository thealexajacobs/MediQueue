import { PatientStatusView } from '@/components/queue/PatientStatusView';

export default async function QueueEntryPage({
  params,
}: {
  params: Promise<{ queueEntryId: string }>;
}) {
  const { queueEntryId } = await params;

  return <PatientStatusView entryId={queueEntryId} />;
}
