-- AlterTable
ALTER TABLE `CASHIERS` ADD COLUMN `handle` VARCHAR(191) NOT NULL DEFAULT UUID();

ALTER TABLE `CASHIERS` MODIFY COLUMN `handle` VARCHAR(191) NOT NULL;
-- CreateIndex
CREATE UNIQUE INDEX `CASHIERS_handle_key` ON `CASHIERS`(`handle`);
