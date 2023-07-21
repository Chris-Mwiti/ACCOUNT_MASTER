/*
  Warnings:

  - You are about to alter the column `balance` on the `generalaccount` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `amount` on the `generaldeposits` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `amount` on the `generalwithdrawals` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `balance` on the `savingsaccount` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `amount` on the `savingsdeposits` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `amount` on the `savingswithdrawals` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `generalaccount` MODIFY `balance` INTEGER NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `generaldeposits` MODIFY `amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `generalwithdrawals` MODIFY `amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `savingsaccount` MODIFY `balance` INTEGER NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `savingsdeposits` MODIFY `amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `savingswithdrawals` MODIFY `amount` INTEGER NOT NULL;
