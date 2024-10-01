/*
  Warnings:

  - The primary key for the `DEPOSIT_NOTIFICATIONS` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `hash` on the `DEPOSIT_NOTIFICATIONS` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE `DEPOSIT_NOTIFICATIONS` DROP PRIMARY KEY,
    MODIFY `hash` VARCHAR(64) NOT NULL,
    ADD PRIMARY KEY (`hash`);
