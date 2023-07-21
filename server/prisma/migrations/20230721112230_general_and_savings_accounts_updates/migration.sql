-- AlterTable
ALTER TABLE `generalaccount` ADD COLUMN `suspensionDuration` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `savingsaccount` ADD COLUMN `suspensionDuration` DATETIME(3) NULL;
