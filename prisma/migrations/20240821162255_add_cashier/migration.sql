-- AlterTable
ALTER TABLE `PLAYERS` ADD COLUMN `cashier_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `CASHIERS` (
    `id` VARCHAR(191) NOT NULL,
    `commission` DOUBLE NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CASHIER_PAYOUTS` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `player_id` VARCHAR(191) NOT NULL,
    `coin_transfer_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CASHIER_PAYOUTS_coin_transfer_id_key`(`coin_transfer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PLAYERS` ADD CONSTRAINT `PLAYERS_cashier_id_fkey` FOREIGN KEY (`cashier_id`) REFERENCES `CASHIERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CASHIER_PAYOUTS` ADD CONSTRAINT `CASHIER_PAYOUTS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CASHIER_PAYOUTS` ADD CONSTRAINT `CASHIER_PAYOUTS_coin_transfer_id_fkey` FOREIGN KEY (`coin_transfer_id`) REFERENCES `COIN_TRANSFERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;