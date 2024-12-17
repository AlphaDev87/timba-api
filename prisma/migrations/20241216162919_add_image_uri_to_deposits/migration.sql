/*
  Warnings:

  - A unique constraint covering the columns `[image_uri]` on the table `DEPOSITS` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `DEPOSITS` ADD COLUMN `image_uri` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DEPOSITS_image_uri_key` ON `DEPOSITS`(`image_uri`);
