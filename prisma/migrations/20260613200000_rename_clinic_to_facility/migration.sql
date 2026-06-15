-- Rename Clinic table to Facility
ALTER TABLE "Clinic" RENAME TO "Facility";

-- Rename columns on User
ALTER TABLE "User" RENAME COLUMN "clinicId" TO "facilityId";

-- Rename columns on Queue
ALTER TABLE "Queue" RENAME COLUMN "clinicId" TO "facilityId";

-- Rename columns on AnalyticsRecord
ALTER TABLE "AnalyticsRecord" RENAME COLUMN "clinicId" TO "facilityId";

-- Rename indexes on User
DROP INDEX IF EXISTS "User_clinicId_idx";
CREATE INDEX "User_facilityId_idx" ON "User"("facilityId");

-- Rename indexes on Queue
DROP INDEX IF EXISTS "Queue_clinicId_idx";
DROP INDEX IF EXISTS "Queue_clinicId_status_idx";
DROP INDEX IF EXISTS "Queue_clinicId_name_key";
CREATE INDEX "Queue_facilityId_idx" ON "Queue"("facilityId");
CREATE INDEX "Queue_facilityId_status_idx" ON "Queue"("facilityId", "status");
CREATE UNIQUE INDEX "Queue_facilityId_name_key" ON "Queue"("facilityId", "name");

-- Rename indexes on AnalyticsRecord
DROP INDEX IF EXISTS "AnalyticsRecord_clinicId_idx";
CREATE INDEX "AnalyticsRecord_facilityId_idx" ON "AnalyticsRecord"("facilityId");

-- Drop old foreign keys
ALTER TABLE "User" DROP CONSTRAINT "User_clinicId_fkey";
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_clinicId_fkey";
ALTER TABLE "AnalyticsRecord" DROP CONSTRAINT "AnalyticsRecord_clinicId_fkey";

-- Add new foreign keys referencing Facility
ALTER TABLE "User" ADD CONSTRAINT "User_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsRecord" ADD CONSTRAINT "AnalyticsRecord_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Rename the primary key sequence for Facility (was Clinic)
ALTER INDEX "Clinic_pkey" RENAME TO "Facility_pkey";
