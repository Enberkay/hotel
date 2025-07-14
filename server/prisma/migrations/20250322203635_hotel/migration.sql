-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `userPassword` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NULL,
    `userSurName` VARCHAR(191) NULL,
    `userNumPhone` VARCHAR(191) NULL,
    `userRole` ENUM('admin', 'customer', 'front', 'housekeeping', 'maintenance') NOT NULL DEFAULT 'customer',
    `prefix` VARCHAR(191) NULL,
    `licensePlate` VARCHAR(191) NULL,
    `userEnable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_userEmail_key`(`userEmail`),
    UNIQUE INDEX `User_userNumPhone_key`(`userNumPhone`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `customerId` INTEGER NOT NULL AUTO_INCREMENT,
    `stdId` VARCHAR(191) NULL,
    `idCard` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `customerTypeId` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `Customer_stdId_key`(`stdId`),
    UNIQUE INDEX `Customer_userId_key`(`userId`),
    PRIMARY KEY (`customerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerType` (
    `customerTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `customerTypeName` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,

    PRIMARY KEY (`customerTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Front` (
    `frontId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Front_userId_key`(`userId`),
    PRIMARY KEY (`frontId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Housekeeping` (
    `housekeepingId` INTEGER NOT NULL AUTO_INCREMENT,
    `assignedFloor` VARCHAR(191) NOT NULL DEFAULT '3',
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Housekeeping_userId_key`(`userId`),
    PRIMARY KEY (`housekeepingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningRequest` (
    `requestId` INTEGER NOT NULL AUTO_INCREMENT,
    `requestAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `receiveAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `housekeepingId` INTEGER NULL,
    `frontId` INTEGER NOT NULL,
    `cleaningRequestStatusId` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`requestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningRequestStatus` (
    `cleaningRequestStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `cleaningRequestStatusName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CleaningRequestStatus_cleaningRequestStatusName_key`(`cleaningRequestStatusName`),
    PRIMARY KEY (`cleaningRequestStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningRequestRoom` (
    `requestId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL DEFAULT '',
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`requestId`, `roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningReport` (
    `reportId` INTEGER NOT NULL AUTO_INCREMENT,
    `reportAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `housekeepingId` INTEGER NOT NULL,
    `frontId` INTEGER NULL,
    `requestId` INTEGER NOT NULL,
    `cleaningReportStatusId` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `CleaningReport_requestId_key`(`requestId`),
    PRIMARY KEY (`reportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningReportStatus` (
    `cleaningReportStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `cleaningReportStatusName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CleaningReportStatus_cleaningReportStatusName_key`(`cleaningReportStatusName`),
    PRIMARY KEY (`cleaningReportStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningReportRoom` (
    `reportId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,

    PRIMARY KEY (`reportId`, `roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningResults` (
    `reportId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL DEFAULT '',
    `cleaningStatusId` INTEGER NOT NULL,

    PRIMARY KEY (`reportId`, `roomId`, `itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningList` (
    `itemId` INTEGER NOT NULL AUTO_INCREMENT,
    `itemName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CleaningStatus` (
    `cleaningStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `cleaningStatusName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cleaningStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maintenance` (
    `maintenanceId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Maintenance_userId_key`(`userId`),
    PRIMARY KEY (`maintenanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairRequest` (
    `requestId` INTEGER NOT NULL AUTO_INCREMENT,
    `requestTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `maintenanceId` INTEGER NOT NULL,
    `frontId` INTEGER NOT NULL,

    PRIMARY KEY (`requestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairDetail` (
    `requestId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`requestId`, `roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairReport` (
    `reportId` INTEGER NOT NULL AUTO_INCREMENT,
    `maintenanceId` INTEGER NOT NULL,
    `frontId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `completionTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `repairStatusId` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`reportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairStatus` (
    `repairStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `repairStatusName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`repairStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `roomId` INTEGER NOT NULL AUTO_INCREMENT,
    `roomNumber` VARCHAR(191) NOT NULL,
    `floor` VARCHAR(191) NOT NULL DEFAULT '3',
    `roomTypeId` INTEGER NOT NULL DEFAULT 0,
    `roomStatusId` INTEGER NOT NULL DEFAULT 0,
    `pairRoomId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Room_roomNumber_key`(`roomNumber`),
    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomType` (
    `roomTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `roomTypeName` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`roomTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomStatus` (
    `roomStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `roomStatusName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`roomStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `bookingId` INTEGER NOT NULL AUTO_INCREMENT,
    `count` INTEGER NOT NULL DEFAULT 1,
    `customerId` INTEGER NOT NULL,
    `roomId` INTEGER NULL,
    `pairRoomId` INTEGER NULL,
    `roomTypeId` INTEGER NULL,
    `frontId` INTEGER NULL,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `checkInDate` DATETIME(3) NOT NULL,
    `checkOutDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `confirmedAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `paymentStatusId` INTEGER NOT NULL DEFAULT 1,
    `bookingStatusId` INTEGER NOT NULL DEFAULT 1,
    `paymentMethodId` INTEGER NULL,

    PRIMARY KEY (`bookingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingAddonListRelation` (
    `bookingId` INTEGER NOT NULL,
    `bookingAddonListId` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,

    PRIMARY KEY (`bookingId`, `bookingAddonListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingAddonList` (
    `bookingAddonListId` INTEGER NOT NULL AUTO_INCREMENT,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`bookingAddonListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingAddon` (
    `addonId` INTEGER NOT NULL,
    `bookingAddonListId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`addonId`, `bookingAddonListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Addon` (
    `addonId` INTEGER NOT NULL AUTO_INCREMENT,
    `addonName` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`addonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingStatus` (
    `bookingStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingStatusName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`bookingStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentStatus` (
    `paymentStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentStatusName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`paymentStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `paymentMethodId` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentMethodName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`paymentMethodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Receipt` (
    `receiptId` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `frontId` INTEGER NOT NULL,
    `bookingId` INTEGER NOT NULL,

    UNIQUE INDEX `Receipt_bookingId_key`(`bookingId`),
    PRIMARY KEY (`receiptId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` VARCHAR(191) NOT NULL,
    `public_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `secure_url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `bookingId` INTEGER NULL,
    `customerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_customerTypeId_fkey` FOREIGN KEY (`customerTypeId`) REFERENCES `CustomerType`(`customerTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Front` ADD CONSTRAINT `Front_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Housekeeping` ADD CONSTRAINT `Housekeeping_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningRequest` ADD CONSTRAINT `CleaningRequest_housekeepingId_fkey` FOREIGN KEY (`housekeepingId`) REFERENCES `Housekeeping`(`housekeepingId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningRequest` ADD CONSTRAINT `CleaningRequest_frontId_fkey` FOREIGN KEY (`frontId`) REFERENCES `Front`(`frontId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningRequest` ADD CONSTRAINT `CleaningRequest_cleaningRequestStatusId_fkey` FOREIGN KEY (`cleaningRequestStatusId`) REFERENCES `CleaningRequestStatus`(`cleaningRequestStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningRequestRoom` ADD CONSTRAINT `CleaningRequestRoom_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `CleaningRequest`(`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningRequestRoom` ADD CONSTRAINT `CleaningRequestRoom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningReport` ADD CONSTRAINT `CleaningReport_housekeepingId_fkey` FOREIGN KEY (`housekeepingId`) REFERENCES `Housekeeping`(`housekeepingId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningReport` ADD CONSTRAINT `CleaningReport_frontId_fkey` FOREIGN KEY (`frontId`) REFERENCES `Front`(`frontId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningReport` ADD CONSTRAINT `CleaningReport_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `CleaningRequest`(`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningReport` ADD CONSTRAINT `CleaningReport_cleaningReportStatusId_fkey` FOREIGN KEY (`cleaningReportStatusId`) REFERENCES `CleaningReportStatus`(`cleaningReportStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningReportRoom` ADD CONSTRAINT `CleaningReportRoom_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `CleaningReport`(`reportId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningReportRoom` ADD CONSTRAINT `CleaningReportRoom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningResults` ADD CONSTRAINT `CleaningResults_cleaningStatusId_fkey` FOREIGN KEY (`cleaningStatusId`) REFERENCES `CleaningStatus`(`cleaningStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningResults` ADD CONSTRAINT `CleaningResults_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `CleaningReport`(`reportId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningResults` ADD CONSTRAINT `CleaningResults_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `CleaningList`(`itemId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CleaningResults` ADD CONSTRAINT `CleaningResults_reportId_roomId_fkey` FOREIGN KEY (`reportId`, `roomId`) REFERENCES `CleaningReportRoom`(`reportId`, `roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `Maintenance`(`maintenanceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_frontId_fkey` FOREIGN KEY (`frontId`) REFERENCES `Front`(`frontId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairDetail` ADD CONSTRAINT `RepairDetail_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `RepairRequest`(`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairDetail` ADD CONSTRAINT `RepairDetail_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairReport` ADD CONSTRAINT `RepairReport_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `Maintenance`(`maintenanceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairReport` ADD CONSTRAINT `RepairReport_frontId_fkey` FOREIGN KEY (`frontId`) REFERENCES `Front`(`frontId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairReport` ADD CONSTRAINT `RepairReport_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairReport` ADD CONSTRAINT `RepairReport_repairStatusId_fkey` FOREIGN KEY (`repairStatusId`) REFERENCES `RepairStatus`(`repairStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `RoomType`(`roomTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_roomStatusId_fkey` FOREIGN KEY (`roomStatusId`) REFERENCES `RoomStatus`(`roomStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_pairRoomId_fkey` FOREIGN KEY (`pairRoomId`) REFERENCES `Room`(`roomId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`customerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_pairRoomId_fkey` FOREIGN KEY (`pairRoomId`) REFERENCES `Room`(`roomId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `RoomType`(`roomTypeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_frontId_fkey` FOREIGN KEY (`frontId`) REFERENCES `Front`(`frontId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_paymentStatusId_fkey` FOREIGN KEY (`paymentStatusId`) REFERENCES `PaymentStatus`(`paymentStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_bookingStatusId_fkey` FOREIGN KEY (`bookingStatusId`) REFERENCES `BookingStatus`(`bookingStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `PaymentMethod`(`paymentMethodId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingAddonListRelation` ADD CONSTRAINT `BookingAddonListRelation_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`bookingId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingAddonListRelation` ADD CONSTRAINT `BookingAddonListRelation_bookingAddonListId_fkey` FOREIGN KEY (`bookingAddonListId`) REFERENCES `BookingAddonList`(`bookingAddonListId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingAddon` ADD CONSTRAINT `BookingAddon_addonId_fkey` FOREIGN KEY (`addonId`) REFERENCES `Addon`(`addonId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingAddon` ADD CONSTRAINT `BookingAddon_bookingAddonListId_fkey` FOREIGN KEY (`bookingAddonListId`) REFERENCES `BookingAddonList`(`bookingAddonListId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`customerId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_frontId_fkey` FOREIGN KEY (`frontId`) REFERENCES `Front`(`frontId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`bookingId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`bookingId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`customerId`) ON DELETE CASCADE ON UPDATE CASCADE;
