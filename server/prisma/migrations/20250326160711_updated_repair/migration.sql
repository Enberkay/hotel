/*
  Warnings:

  - You are about to drop the column `completedAt` on the `cleaningrequestroom` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `cleaningrequestroom` table. All the data in the column will be lost.
  - You are about to drop the column `completionTime` on the `repairreport` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `repairreport` table. All the data in the column will be lost.
  - You are about to drop the `repairdetail` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[requestId]` on the table `RepairReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requestId` to the `RepairReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `repairdetail` DROP FOREIGN KEY `RepairDetail_requestId_fkey`;

-- DropForeignKey
ALTER TABLE `repairdetail` DROP FOREIGN KEY `RepairDetail_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `repairreport` DROP FOREIGN KEY `RepairReport_roomId_fkey`;

-- DropIndex
DROP INDEX `RepairReport_roomId_fkey` ON `repairreport`;

-- AlterTable
ALTER TABLE `cleaningrequestroom` DROP COLUMN `completedAt`,
    DROP COLUMN `isCompleted`;

-- AlterTable
ALTER TABLE `repairreport` DROP COLUMN `completionTime`,
    DROP COLUMN `roomId`,
    ADD COLUMN `reportAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `requestId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `repairdetail`;

-- CreateTable
CREATE TABLE `RepairRequestRoom` (
    `requestId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`requestId`, `roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairReportRoom` (
    `reportId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,

    PRIMARY KEY (`reportId`, `roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `RepairReport_requestId_key` ON `RepairReport`(`requestId`);

-- AddForeignKey
ALTER TABLE `RepairRequestRoom` ADD CONSTRAINT `RepairRequestRoom_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `RepairRequest`(`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequestRoom` ADD CONSTRAINT `RepairRequestRoom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairReport` ADD CONSTRAINT `RepairReport_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `RepairRequest`(`requestId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairReportRoom` ADD CONSTRAINT `RepairReportRoom_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `RepairReport`(`reportId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairReportRoom` ADD CONSTRAINT `RepairReportRoom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;
