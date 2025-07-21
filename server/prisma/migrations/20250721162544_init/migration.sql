-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'customer', 'front', 'housekeeping', 'maintenance');

-- CreateEnum
CREATE TYPE "CleaningRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CleaningReportStatus" AS ENUM ('PENDING', 'CHECKED', 'REPORTED');

-- CreateEnum
CREATE TYPE "CleaningStatus" AS ENUM ('NORMAL', 'PROBLEM');

-- CreateEnum
CREATE TYPE "RepairRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RepairStatus" AS ENUM ('FIXED', 'UNFIXABLE');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT,
    "userName" TEXT,
    "userSurName" TEXT,
    "userNumPhone" TEXT,
    "userRole" "UserRole" NOT NULL DEFAULT 'customer',
    "prefix" TEXT,
    "licensePlate" TEXT,
    "stdId" TEXT,
    "idCard" TEXT,
    "assignedFloor" TEXT,
    "userEnable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "CleaningRequest" (
    "requestId" SERIAL NOT NULL,
    "requestAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiveAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "housekeepingId" INTEGER,
    "frontId" INTEGER NOT NULL,
    "cleaningRequestStatus" "CleaningRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "CleaningRequest_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "CleaningRequestRoom" (
    "requestId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "description" TEXT DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CleaningRequestRoom_pkey" PRIMARY KEY ("requestId","roomId")
);

-- CreateTable
CREATE TABLE "CleaningReport" (
    "reportId" SERIAL NOT NULL,
    "reportAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "housekeepingId" INTEGER NOT NULL,
    "frontId" INTEGER,
    "requestId" INTEGER NOT NULL,
    "cleaningReportStatus" "CleaningReportStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "CleaningReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "CleaningReportRoom" (
    "reportId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "CleaningReportRoom_pkey" PRIMARY KEY ("reportId","roomId")
);

-- CreateTable
CREATE TABLE "CleaningResults" (
    "reportId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "description" TEXT DEFAULT '',
    "cleaningStatus" "CleaningStatus" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "CleaningResults_pkey" PRIMARY KEY ("reportId","roomId","itemId")
);

-- CreateTable
CREATE TABLE "CleaningList" (
    "itemId" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,

    CONSTRAINT "CleaningList_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "RepairRequest" (
    "requestId" SERIAL NOT NULL,
    "requestAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maintenanceId" INTEGER,
    "frontId" INTEGER NOT NULL,
    "repairRequestStatus" "RepairRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RepairRequest_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "RepairRequestRoom" (
    "requestId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "RepairRequestRoom_pkey" PRIMARY KEY ("requestId","roomId")
);

-- CreateTable
CREATE TABLE "RepairReport" (
    "reportId" SERIAL NOT NULL,
    "reportAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maintenanceId" INTEGER NOT NULL,
    "frontId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,

    CONSTRAINT "RepairReport_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "RepairReportRoom" (
    "reportId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "description" TEXT,
    "repairStatus" "RepairStatus" NOT NULL DEFAULT 'FIXED',

    CONSTRAINT "RepairReportRoom_pkey" PRIMARY KEY ("reportId","roomId")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomId" SERIAL NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "floor" TEXT NOT NULL DEFAULT '3',
    "roomTypeId" INTEGER NOT NULL DEFAULT 0,
    "roomStatus" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE',
    "pairRoomId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "RoomType" (
    "roomTypeId" SERIAL NOT NULL,
    "roomTypeName" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("roomTypeId")
);

-- CreateTable
CREATE TABLE "Booking" (
    "bookingId" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "customerId" INTEGER NOT NULL,
    "roomId" INTEGER,
    "pairRoomId" INTEGER,
    "roomTypeId" INTEGER,
    "frontId" INTEGER,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("bookingId")
);

-- CreateTable
CREATE TABLE "BookingAddonListRelation" (
    "bookingId" INTEGER NOT NULL,
    "bookingAddonListId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BookingAddonListRelation_pkey" PRIMARY KEY ("bookingId","bookingAddonListId")
);

-- CreateTable
CREATE TABLE "BookingAddonList" (
    "bookingAddonListId" SERIAL NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingAddonList_pkey" PRIMARY KEY ("bookingAddonListId")
);

-- CreateTable
CREATE TABLE "BookingAddon" (
    "addonId" INTEGER NOT NULL,
    "bookingAddonListId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "BookingAddon_pkey" PRIMARY KEY ("addonId","bookingAddonListId")
);

-- CreateTable
CREATE TABLE "Addon" (
    "addonId" SERIAL NOT NULL,
    "addonName" TEXT NOT NULL,
    "addonName_en" TEXT NOT NULL,
    "addonName_th" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("addonId")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "receiptId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "frontId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("receiptId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "User_userNumPhone_key" ON "User"("userNumPhone");

-- CreateIndex
CREATE INDEX "User_userEmail_idx" ON "User"("userEmail");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CleaningReport_requestId_key" ON "CleaningReport"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "RepairReport_requestId_key" ON "RepairReport"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

-- CreateIndex
CREATE INDEX "Room_roomNumber_idx" ON "Room"("roomNumber");

-- CreateIndex
CREATE INDEX "Room_roomId_idx" ON "Room"("roomId");

-- CreateIndex
CREATE INDEX "RoomType_roomTypeId_idx" ON "RoomType"("roomTypeId");

-- CreateIndex
CREATE INDEX "Booking_bookingId_idx" ON "Booking"("bookingId");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_roomId_idx" ON "Booking"("roomId");

-- CreateIndex
CREATE INDEX "Booking_frontId_idx" ON "Booking"("frontId");

-- CreateIndex
CREATE INDEX "Booking_roomTypeId_idx" ON "Booking"("roomTypeId");

-- CreateIndex
CREATE INDEX "Addon_addonId_idx" ON "Addon"("addonId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_bookingId_key" ON "Receipt"("bookingId");

-- CreateIndex
CREATE INDEX "Receipt_customerId_idx" ON "Receipt"("customerId");

-- CreateIndex
CREATE INDEX "Receipt_roomId_idx" ON "Receipt"("roomId");

-- CreateIndex
CREATE INDEX "Receipt_frontId_idx" ON "Receipt"("frontId");

-- CreateIndex
CREATE INDEX "Receipt_bookingId_idx" ON "Receipt"("bookingId");

-- AddForeignKey
ALTER TABLE "CleaningRequest" ADD CONSTRAINT "CleaningRequest_housekeepingId_fkey" FOREIGN KEY ("housekeepingId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningRequest" ADD CONSTRAINT "CleaningRequest_frontId_fkey" FOREIGN KEY ("frontId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningRequestRoom" ADD CONSTRAINT "CleaningRequestRoom_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CleaningRequest"("requestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningRequestRoom" ADD CONSTRAINT "CleaningRequestRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningReport" ADD CONSTRAINT "CleaningReport_housekeepingId_fkey" FOREIGN KEY ("housekeepingId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningReport" ADD CONSTRAINT "CleaningReport_frontId_fkey" FOREIGN KEY ("frontId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningReport" ADD CONSTRAINT "CleaningReport_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CleaningRequest"("requestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningReportRoom" ADD CONSTRAINT "CleaningReportRoom_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CleaningReport"("reportId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningReportRoom" ADD CONSTRAINT "CleaningReportRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningResults" ADD CONSTRAINT "CleaningResults_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CleaningReport"("reportId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningResults" ADD CONSTRAINT "CleaningResults_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "CleaningList"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningResults" ADD CONSTRAINT "CleaningResults_reportId_roomId_fkey" FOREIGN KEY ("reportId", "roomId") REFERENCES "CleaningReportRoom"("reportId", "roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairRequest" ADD CONSTRAINT "RepairRequest_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairRequest" ADD CONSTRAINT "RepairRequest_frontId_fkey" FOREIGN KEY ("frontId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairRequestRoom" ADD CONSTRAINT "RepairRequestRoom_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "RepairRequest"("requestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairRequestRoom" ADD CONSTRAINT "RepairRequestRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairReport" ADD CONSTRAINT "RepairReport_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairReport" ADD CONSTRAINT "RepairReport_frontId_fkey" FOREIGN KEY ("frontId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairReport" ADD CONSTRAINT "RepairReport_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "RepairRequest"("requestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairReportRoom" ADD CONSTRAINT "RepairReportRoom_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "RepairReport"("reportId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairReportRoom" ADD CONSTRAINT "RepairReportRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("roomTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_pairRoomId_fkey" FOREIGN KEY ("pairRoomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_pairRoomId_fkey" FOREIGN KEY ("pairRoomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("roomTypeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_frontId_fkey" FOREIGN KEY ("frontId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddonListRelation" ADD CONSTRAINT "BookingAddonListRelation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddonListRelation" ADD CONSTRAINT "BookingAddonListRelation_bookingAddonListId_fkey" FOREIGN KEY ("bookingAddonListId") REFERENCES "BookingAddonList"("bookingAddonListId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon"("addonId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_bookingAddonListId_fkey" FOREIGN KEY ("bookingAddonListId") REFERENCES "BookingAddonList"("bookingAddonListId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_frontId_fkey" FOREIGN KEY ("frontId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("bookingId") ON DELETE CASCADE ON UPDATE CASCADE;
