-- AlterTable
ALTER TABLE `DEPOSITS` MODIFY `tracking_number` VARCHAR(191) NULL,
    MODIFY `amount` DOUBLE NULL,
    MODIFY `date` DATETIME(3) NULL,
    MODIFY `sending_bank` VARCHAR(191) NULL;
