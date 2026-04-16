-- CreateEnum
CREATE TYPE "TrafficSource" AS ENUM ('DIRECT', 'ORGANIC_SEARCH', 'SOCIAL', 'EMAIL', 'REFERRAL', 'ADS', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PublicEventType" AS ENUM ('CTA_RESERVATION', 'CTA_DIRECTIONS', 'CTA_CONTACT', 'FAQ_VIEW', 'MENU_VIEW', 'CONTACT_SUBMIT');

-- CreateTable
CREATE TABLE "SearchPerformanceDaily" (
    "id" UUID NOT NULL,
    "restaurantId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "pagePath" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averagePosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'google_search_console',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchPerformanceDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicVisit" (
    "id" UUID NOT NULL,
    "restaurantId" UUID,
    "sessionKey" TEXT NOT NULL,
    "pagePath" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "source" "TrafficSource" NOT NULL DEFAULT 'UNKNOWN',
    "referrer" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicEvent" (
    "id" UUID NOT NULL,
    "visitId" UUID,
    "restaurantId" UUID,
    "sessionKey" TEXT,
    "pagePath" TEXT NOT NULL,
    "type" "PublicEventType" NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchPerformanceDaily_restaurantId_date_idx" ON "SearchPerformanceDaily"("restaurantId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SearchPerformanceDaily_restaurantId_date_pagePath_key" ON "SearchPerformanceDaily"("restaurantId", "date", "pagePath");

-- CreateIndex
CREATE INDEX "PublicVisit_restaurantId_createdAt_idx" ON "PublicVisit"("restaurantId", "createdAt");

-- CreateIndex
CREATE INDEX "PublicVisit_sessionKey_createdAt_idx" ON "PublicVisit"("sessionKey", "createdAt");

-- CreateIndex
CREATE INDEX "PublicVisit_pagePath_createdAt_idx" ON "PublicVisit"("pagePath", "createdAt");

-- CreateIndex
CREATE INDEX "PublicVisit_source_createdAt_idx" ON "PublicVisit"("source", "createdAt");

-- CreateIndex
CREATE INDEX "PublicEvent_restaurantId_type_createdAt_idx" ON "PublicEvent"("restaurantId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "PublicEvent_sessionKey_createdAt_idx" ON "PublicEvent"("sessionKey", "createdAt");

-- CreateIndex
CREATE INDEX "PublicEvent_pagePath_createdAt_idx" ON "PublicEvent"("pagePath", "createdAt");

-- AddForeignKey
ALTER TABLE "SearchPerformanceDaily" ADD CONSTRAINT "SearchPerformanceDaily_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicVisit" ADD CONSTRAINT "PublicVisit_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicEvent" ADD CONSTRAINT "PublicEvent_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PublicVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicEvent" ADD CONSTRAINT "PublicEvent_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
