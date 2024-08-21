-- DropForeignKey
ALTER TABLE `PLAYERS` DROP FOREIGN KEY `PLAYERS_cashier_id_fkey`;

-- AddForeignKey
ALTER TABLE `PLAYERS` ADD CONSTRAINT `PLAYERS_cashier_id_fkey` FOREIGN KEY (`cashier_id`) REFERENCES `CASHIERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
