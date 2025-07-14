/*
  Warnings:

  - You are about to drop the column `repairStatusId` on the `repairreport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `repairreport` DROP FOREIGN KEY `RepairReport_repairStatusId_fkey`;

-- DropIndex
DROP INDEX `RepairReport_repairStatusId_fkey` ON `repairreport`;

-- AlterTable
ALTER TABLE `repairreport` DROP COLUMN `repairStatusId`;

-- AlterTable
ALTER TABLE `repairreportroom` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `repairStatusId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `RepairReportRoom` ADD CONSTRAINT `RepairReportRoom_repairStatusId_fkey` FOREIGN KEY (`repairStatusId`) REFERENCES `RepairStatus`(`repairStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;
