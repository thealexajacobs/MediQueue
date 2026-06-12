-- AlterTable
ALTER TABLE "AnalyticsRecord" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "QueueEntry" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "QueueEvent" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "AnalyticsRecord_deletedAt_idx" ON "AnalyticsRecord"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_clinicId_name_key" ON "Queue"("clinicId", "name");

-- CreateIndex
CREATE INDEX "QueueEntry_deletedAt_idx" ON "QueueEntry"("deletedAt");

-- CreateIndex
CREATE INDEX "QueueEvent_deletedAt_idx" ON "QueueEvent"("deletedAt");
