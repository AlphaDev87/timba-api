-- CreateTable
CREATE TABLE `AGENT_CONFIG` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `bankAccount` JSON NULL,
    `alq_api_manager` TEXT NULL,
    `alq_token` VARCHAR(800) NULL,
    `bot_phone` VARCHAR(20) NULL,
    `human_phone` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AGENT_CONFIG_player_id_key`(`player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TRANSACTIONS` (
    `id` VARCHAR(191) NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `recipient_id` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `ok` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PLAYERS` (
    `id` VARCHAR(191) NOT NULL,
    `panel_id` INTEGER NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` TEXT NOT NULL,
    `email` VARCHAR(50) NULL,
    `first_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `movile_number` VARCHAR(50) NULL,
    `country` VARCHAR(50) NULL,
    `balance_currency` VARCHAR(10) NOT NULL DEFAULT 'MXN',
    `status` VARCHAR(20) NULL DEFAULT 'ACTIVO',
    `cashier_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PLAYERS_panel_id_key`(`panel_id`),
    UNIQUE INDEX `PLAYERS_username_key`(`username`),
    UNIQUE INDEX `PLAYERS_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PAYMENTS` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PEDIDO',
    `bank_account` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'MXN',
    `dirty` BOOLEAN NOT NULL DEFAULT false,
    `alquimia_id` INTEGER NULL,
    `coin_transfer_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PAYMENTS_coin_transfer_id_key`(`coin_transfer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BANK_ACCOUNTS` (
    `id` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `bankId` VARCHAR(191) NOT NULL,
    `bankNumber` VARCHAR(191) NOT NULL,
    `bankAlias` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BANK_ACCOUNTS_bankNumber_key`(`bankNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DEPOSITS` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'MXN',
    `dirty` BOOLEAN NOT NULL DEFAULT true,
    `status` VARCHAR(191) NOT NULL,
    `tracking_number` VARCHAR(191) NULL,
    `amount` DOUBLE NULL,
    `date` DATETIME(3) NULL,
    `sending_bank` VARCHAR(191) NULL,
    `cep_ok` BOOLEAN NOT NULL DEFAULT false,
    `coin_transfer_id` VARCHAR(191) NOT NULL,
    `image_uri` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DEPOSITS_tracking_number_key`(`tracking_number`),
    UNIQUE INDEX `DEPOSITS_coin_transfer_id_key`(`coin_transfer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TOKENS` (
    `id` VARCHAR(191) NOT NULL,
    `invalid` BOOLEAN NOT NULL DEFAULT false,
    `next` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WEB_PUSH_SUBSCRIPTIONS` (
    `id` VARCHAR(191) NOT NULL,
    `endpoint` VARCHAR(512) NOT NULL,
    `keys` JSON NOT NULL,
    `expirationTime` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WEB_PUSH_SUBSCRIPTIONS_endpoint_key`(`endpoint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ROLES` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ROLES_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BOT_FLOWS` (
    `id` VARCHAR(191) NOT NULL,
    `menus` JSON NOT NULL,
    `messages` JSON NOT NULL,
    `on_call` BOOLEAN NOT NULL,
    `active` BOOLEAN NOT NULL,
    `name` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PASSWORD_RESET_TOKENS` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(342) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CHAT_DATA` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CHAT_DATA_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ANALYTICS` (
    `id` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `event` VARCHAR(191) NOT NULL,
    `data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BONUS` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(32) NOT NULL,
    `percentage` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `coin_transfer_id` VARCHAR(191) NOT NULL,
    `dirty` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BONUS_player_id_key`(`player_id`),
    UNIQUE INDEX `BONUS_coin_transfer_id_key`(`coin_transfer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `COIN_TRANSFERS` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(32) NOT NULL,
    `player_balance_after` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CASHIERS` (
    `id` VARCHAR(191) NOT NULL,
    `handle` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` TEXT NOT NULL,
    `panel_id` INTEGER NULL,
    `access` VARCHAR(800) NULL,
    `refresh` VARCHAR(800) NULL,
    `dirty` BOOLEAN NOT NULL DEFAULT false,
    `last_cashout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CASHIERS_handle_key`(`handle`),
    UNIQUE INDEX `CASHIERS_username_key`(`username`),
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

-- CreateTable
CREATE TABLE `BOT_HISTORY` (
    `id` VARCHAR(191) NOT NULL,
    `ref` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NULL,
    `answer` TEXT NOT NULL,
    `refSerialize` VARCHAR(191) NULL,
    `from` VARCHAR(191) NOT NULL,
    `options` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DEPOSIT_NOTIFICATIONS` (
    `hash` VARCHAR(64) NOT NULL,

    PRIMARY KEY (`hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PlayerToRole` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PlayerToRole_AB_unique`(`A`, `B`),
    INDEX `_PlayerToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AGENT_CONFIG` ADD CONSTRAINT `AGENT_CONFIG_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PLAYERS` ADD CONSTRAINT `PLAYERS_cashier_id_fkey` FOREIGN KEY (`cashier_id`) REFERENCES `CASHIERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PAYMENTS` ADD CONSTRAINT `PAYMENTS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PAYMENTS` ADD CONSTRAINT `PAYMENTS_bank_account_fkey` FOREIGN KEY (`bank_account`) REFERENCES `BANK_ACCOUNTS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PAYMENTS` ADD CONSTRAINT `PAYMENTS_coin_transfer_id_fkey` FOREIGN KEY (`coin_transfer_id`) REFERENCES `COIN_TRANSFERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BANK_ACCOUNTS` ADD CONSTRAINT `BANK_ACCOUNTS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DEPOSITS` ADD CONSTRAINT `DEPOSITS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DEPOSITS` ADD CONSTRAINT `DEPOSITS_coin_transfer_id_fkey` FOREIGN KEY (`coin_transfer_id`) REFERENCES `COIN_TRANSFERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TOKENS` ADD CONSTRAINT `TOKENS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PASSWORD_RESET_TOKENS` ADD CONSTRAINT `PASSWORD_RESET_TOKENS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BONUS` ADD CONSTRAINT `BONUS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BONUS` ADD CONSTRAINT `BONUS_coin_transfer_id_fkey` FOREIGN KEY (`coin_transfer_id`) REFERENCES `COIN_TRANSFERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CASHIER_PAYOUTS` ADD CONSTRAINT `CASHIER_PAYOUTS_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CASHIER_PAYOUTS` ADD CONSTRAINT `CASHIER_PAYOUTS_coin_transfer_id_fkey` FOREIGN KEY (`coin_transfer_id`) REFERENCES `COIN_TRANSFERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToRole` ADD CONSTRAINT `_PlayerToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `PLAYERS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToRole` ADD CONSTRAINT `_PlayerToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `ROLES`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
