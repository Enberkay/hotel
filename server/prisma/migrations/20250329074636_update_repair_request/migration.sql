/*
  Warnings:

  - You are about to drop the column `requestTime` on the `repairrequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `repairrequest` DROP COLUMN `requestTime`,
    ADD COLUMN `requestAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
