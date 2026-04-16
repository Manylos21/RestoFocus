-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "acceptsReservations" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailPublic" TEXT,
ADD COLUMN     "googleMapsUrl" TEXT,
ADD COLUMN     "openingHours" TEXT,
ADD COLUMN     "reservationUrl" TEXT,
ADD COLUMN     "servesCuisine" TEXT,
ADD COLUMN     "telephone" TEXT;
