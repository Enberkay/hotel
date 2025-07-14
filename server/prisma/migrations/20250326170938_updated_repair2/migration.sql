-- AlterTable
ALTER TABLE `repairrequest` ADD COLUMN `repairRequestStatusId` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `RepairRequestStatus` (
    `repairRequestStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `repairRequestStatusName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`repairRequestStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_repairRequestStatusId_fkey` FOREIGN KEY (`repairRequestStatusId`) REFERENCES `RepairRequestStatus`(`repairRequestStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;
