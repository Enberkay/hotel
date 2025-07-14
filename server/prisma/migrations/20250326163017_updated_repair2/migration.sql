-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_maintenanceId_fkey`;

-- DropIndex
DROP INDEX `RepairRequest_maintenanceId_fkey` ON `repairrequest`;

-- AlterTable
ALTER TABLE `repairrequest` MODIFY `maintenanceId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `Maintenance`(`maintenanceId`) ON DELETE SET NULL ON UPDATE CASCADE;
