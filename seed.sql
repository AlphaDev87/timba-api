INSERT INTO `PLAYERS` (`panel_id`, `username`, `password`, `email`, `first_name`, `last_name`, `date_of_birth`, `movile_number`, `country`, `balance_currency`, `status`, `created_at`, `updated_at`) VALUES
(3900,	'test19',	'03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'MX',	'ACTIVO',	'2024-02-02 16:01:19.264',	'2024-02-02 16:01:19.264'),
(3859,	'test17',	'03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'MX',	'ACTIVO',	'2024-02-06 11:45:04.408',	'2024-02-06 11:45:04.408'),
(3940,	'test20',	'03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'MXN',	'ACTIVO',	'2024-02-09 19:57:41.941',	'2024-02-09 19:57:41.941');

INSERT INTO `BANK_ACCOUNTS` (`id`,`owner`, `owner_id`, `player_id`, `bankName`, `bankNumber`, `bankAlias`, `created_at`, `updated_at`) VALUES
(7,	    'Hermione Granger', 33666999, 3900,	'Gringots',     '09090090900909',	         'leviosa.not.leviosaa',        '2024-02-09 16:29:01.929',	'2024-02-09 16:29:01.929'),
(11,	'Ron Weasley',      33999666, 3859,	'Gringots',	        '1111111111',	         'slug.eater',                  '2024-02-09 16:31:48.257',	'2024-02-09 16:31:48.257'),
(18,	'Ron Weasley',      33999666, 3859,	'Gringots',	        '0000000000',	         'king.of.chess',               '2024-02-09 23:01:31.448',	'2024-02-09 23:01:31.448');


INSERT INTO `DEPOSITS` (`id`, `player_id`, `amount`, `confirmed`, `bank_account`, `created_at`, `updated_at`) VALUES
(1,	3900,	0.01,	NULL,	7,	'2024-02-09 10:53:42.309',	'2024-02-09 16:53:42.309'),
(2,	3859,	0.01,	NULL,	11,	'2024-02-09 17:17:03.464',	'2024-02-09 17:17:03.464'),
(3,	3859,	0.01,	'2024-02-09 17:25:17.456',	11,	'2024-02-09 17:17:17.456',	'2024-02-09 17:17:17.456'),
(4,	3900,	0.01,	NULL,	7,	'2024-02-09 17:17:42.984',	'2024-02-09 17:17:42.984');


INSERT INTO `PAYMENTS` (`id`, `player_id`, `amount`, `created_at`, `paid`, `updated_at`, `bank_account`) VALUES
(14,	3900,	0.01,	'2024-02-09 16:53:58.353',	'2024-02-10 17:21:33.262',	'2024-02-10 17:21:33.266',	7),
(15,	3859,	0.01,	'2024-02-09 10:17:14.812',	NULL,	'2024-02-09 17:17:14.812',	11),
(16,	3859,	0.01,	'2024-02-09 17:17:19.661',	NULL,	'2024-02-09 17:17:19.661',	11),
(17,	3900,	0.01,	'2024-02-09 17:17:45.751',	'2024-02-09 17:31:56.085',	'2024-02-09 17:31:56.088',	7);


SET NAMES utf8mb4;

INSERT INTO `TRANSACTIONS` (`id`, `sender_id`, `recipient_id`, `amount`, `date`, `status`, `created_at`, `updated_at`) VALUES
(1,	414,	3900,	0.01,	'2024-02-05 16:39:11.489',	'COMPLETED',	'2024-02-05 16:39:14.002',	'2024-02-05 16:39:14.002'),
(2,	3900,	414,	10,	'2024-02-05 16:39:42.832',	'INCOMPLETE',	'2024-02-05 16:39:43.845',	'2024-02-05 16:39:43.845'),
(3,	414,	3756,	0.01,	'2024-02-05 21:25:23.672',	'COMPLETED',	'2024-02-05 21:25:26.163',	'2024-02-05 21:25:26.163'),
(4,	3756,	414,	0.01,	'2024-02-05 21:26:00.933',	'COMPLETED',	'2024-02-05 21:26:01.942',	'2024-02-05 21:26:01.942'),
(5,	3756,	414,	0.01,	'2024-02-05 21:28:01.455',	'INCOMPLETE',	'2024-02-05 21:28:02.368',	'2024-02-05 21:28:02.368'),
(6,	414,	3756,	0.01,	'2024-02-05 21:28:25.349',	'COMPLETED',	'2024-02-05 21:28:26.400',	'2024-02-05 21:28:26.400'),
(7,	3756,	414,	0.01,	'2024-02-05 21:28:29.644',	'COMPLETED',	'2024-02-05 21:28:30.664',	'2024-02-05 21:28:30.664'),
(8,	414,	3756,	0.01,	'2024-02-05 21:29:34.718',	'COMPLETED',	'2024-02-05 21:29:37.087',	'2024-02-05 21:29:37.087'),
(9,	3756,	414,	0.01,	'2024-02-05 21:29:39.239',	'COMPLETED',	'2024-02-05 21:29:40.231',	'2024-02-05 21:29:40.231'),
(10,	414,	3756,	0.01,	'2024-02-05 21:31:40.766',	'COMPLETED',	'2024-02-05 21:31:43.209',	'2024-02-05 21:31:43.209'),
(11,	3756,	414,	0.01,	'2024-02-05 21:31:49.780',	'COMPLETED',	'2024-02-05 21:31:50.836',	'2024-02-05 21:31:50.836'),
(12,	414,	3900,	0.01,	'2024-02-05 21:33:02.447',	'COMPLETED',	'2024-02-05 21:33:03.438',	'2024-02-05 21:33:03.438'),
(13,	3900,	414,	0.01,	'2024-02-05 21:33:13.132',	'COMPLETED',	'2024-02-05 21:33:14.138',	'2024-02-05 21:33:14.138'),
(14,	414,	3940,	0.01,	'2024-02-06 18:41:19.825',	'COMPLETED',	'2024-02-06 18:41:20.972',	'2024-02-06 18:41:20.972'),
(15,	3940,	414,	0.01,	'2024-02-06 18:42:10.931',	'COMPLETED',	'2024-02-06 18:42:12.003',	'2024-02-06 18:42:12.003'),
(16,	3940,	414,	0.01,	'2024-02-06 18:43:23.159',	'INCOMPLETE',	'2024-02-06 18:43:24.151',	'2024-02-06 18:43:24.151'),
(17,	414,	3940,	0.01,	'2024-02-06 18:44:00.081',	'COMPLETED',	'2024-02-06 18:44:01.089',	'2024-02-06 18:44:01.089'),
(18,	3940,	414,	0.01,	'2024-02-06 18:44:04.801',	'COMPLETED',	'2024-02-06 18:44:05.794',	'2024-02-06 18:44:05.794'),
(19,	414,	3940,	0.01,	'2024-02-06 18:44:54.579',	'COMPLETED',	'2024-02-06 18:44:56.905',	'2024-02-06 18:44:56.905'),
(20,	3940,	414,	0.01,	'2024-02-06 18:46:38.723',	'COMPLETED',	'2024-02-06 18:46:41.016',	'2024-02-06 18:46:41.016'),
(21,	414,	3940,	0.01,	'2024-02-06 18:46:43.538',	'COMPLETED',	'2024-02-06 18:46:44.521',	'2024-02-06 18:46:44.521'),
(22,	3940,	414,	0.01,	'2024-02-06 18:47:10.010',	'COMPLETED',	'2024-02-06 18:47:10.971',	'2024-02-06 18:47:10.971'),
(23,	414,	3940,	0.01,	'2024-02-06 18:47:53.277',	'COMPLETED',	'2024-02-06 18:47:55.818',	'2024-02-06 18:47:55.818'),
(24,	3940,	414,	0.01,	'2024-02-06 18:47:57.967',	'COMPLETED',	'2024-02-06 18:47:58.985',	'2024-02-06 18:47:58.985'),
(25,	3940,	414,	0.01,	'2024-02-06 18:48:22.081',	'INCOMPLETE',	'2024-02-06 18:48:23.010',	'2024-02-06 18:48:23.010'),
(26,	414,	3940,	0.01,	'2024-02-06 18:48:25.999',	'COMPLETED',	'2024-02-06 18:48:26.978',	'2024-02-06 18:48:26.978'),
(27,	3940,	414,	0.01,	'2024-02-06 18:48:30.751',	'COMPLETED',	'2024-02-06 18:48:31.788',	'2024-02-06 18:48:31.788'),
(28,	414,	3940,	0.01,	'2024-02-06 18:48:54.854',	'COMPLETED',	'2024-02-06 18:48:55.860',	'2024-02-06 18:48:55.860'),
(29,	3940,	414,	0.01,	'2024-02-06 18:48:57.103',	'COMPLETED',	'2024-02-06 18:48:58.211',	'2024-02-06 18:48:58.211'),
(30,	414,	3940,	0.01,	'2024-02-07 19:53:55.020',	'COMPLETED',	'2024-02-07 19:53:57.304',	'2024-02-07 19:53:57.304'),
(31,	3940,	414,	0.01,	'2024-02-07 19:54:14.028',	'COMPLETED',	'2024-02-07 19:54:15.021',	'2024-02-07 19:54:15.021'),
(32,	414,	3940,	0.01,	'2024-02-07 19:54:17.122',	'COMPLETED',	'2024-02-07 19:54:18.078',	'2024-02-07 19:54:18.078'),
(33,	3940,	414,	0.01,	'2024-02-07 19:54:19.737',	'COMPLETED',	'2024-02-07 19:54:20.694',	'2024-02-07 19:54:20.694'),
(34,	414,	3900,	0.01,	'2024-02-07 19:54:28.026',	'COMPLETED',	'2024-02-07 19:54:28.986',	'2024-02-07 19:54:28.986'),
(35,	3900,	414,	0.01,	'2024-02-07 19:54:37.826',	'COMPLETED',	'2024-02-07 19:54:38.809',	'2024-02-07 19:54:38.809'),
(36,	414,	3900,	0.01,	'2024-02-08 14:36:33.734',	'COMPLETED',	'2024-02-08 14:36:36.083',	'2024-02-08 14:36:36.083'),
(37,	3900,	414,	0.01,	'2024-02-08 14:36:37.707',	'COMPLETED',	'2024-02-08 14:36:38.696',	'2024-02-08 14:36:38.696'),
(38,	414,	3900,	0.01,	'2024-02-08 18:00:06.145',	'COMPLETED',	'2024-02-08 18:00:08.356',	'2024-02-08 18:00:08.356'),
(39,	3900,	414,	0.01,	'2024-02-08 18:00:09.541',	'COMPLETED',	'2024-02-08 18:00:10.487',	'2024-02-08 18:00:10.487'),
(40,	414,	3900,	0.01,	'2024-02-08 20:01:12.041',	'COMPLETED',	'2024-02-08 20:01:14.298',	'2024-02-08 20:01:14.298'),
(41,	3900,	414,	0.01,	'2024-02-08 20:01:16.316',	'COMPLETED',	'2024-02-08 20:01:17.265',	'2024-02-08 20:01:17.265'),
(42,	3900,	414,	0.01,	'2024-02-08 20:01:21.267',	'COMPLETED',	'2024-02-08 20:01:22.271',	'2024-02-08 20:01:22.271'),
(43,	414,	3900,	0.01,	'2024-02-09 16:53:39.874',	'COMPLETED',	'2024-02-09 16:53:42.302',	'2024-02-09 16:53:42.302'),
(44,	3900,	414,	0.01,	'2024-02-09 16:53:57.290',	'COMPLETED',	'2024-02-09 16:53:58.347',	'2024-02-09 16:53:58.347'),
(45,	414,	3859,	0.01,	'2024-02-09 17:17:01.536',	'COMPLETED',	'2024-02-09 17:17:03.455',	'2024-02-09 17:17:03.455'),
(46,	3859,	414,	0.01,	'2024-02-09 17:17:13.748',	'COMPLETED',	'2024-02-09 17:17:14.805',	'2024-02-09 17:17:14.805'),
(47,	414,	3859,	0.01,	'2024-02-09 17:17:16.444',	'COMPLETED',	'2024-02-09 17:17:17.450',	'2024-02-09 17:17:17.450'),
(48,	3859,	414,	0.01,	'2024-02-09 17:17:18.675',	'COMPLETED',	'2024-02-09 17:17:19.655',	'2024-02-09 17:17:19.655'),
(49,	414,	3900,	0.01,	'2024-02-09 17:17:42.044',	'COMPLETED',	'2024-02-09 17:17:42.976',	'2024-02-09 17:17:42.976'),
(50,	3900,	414,	0.01,	'2024-02-09 17:17:44.789',	'COMPLETED',	'2024-02-09 17:17:45.744',	'2024-02-09 17:17:45.744');

SET NAMES utf8mb4;

INSERT INTO `USERS_ROOT` (`id`, `username`, `password`, `panel_id`, `access`, `refresh`, `json_response`, `created_at`, `updated_at`, `dirty`) VALUES
('acc56f41-b090-409e-8d39-ac15932d9291',	'luquin',	'{\"ivArray\":[\"98\",\"178\",\"232\",\"94\",\"155\",\"6\",\"15\",\"40\",\"39\",\"234\",\"143\",\"28\",\"44\",\"43\",\"56\",\"92\"],\"ciphertext\":\"a2b3df852669cf01f9983953dc67cf43\"}',	414,	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA3NTExMjIwLCJqdGkiOiJhNTBmOThlYzMwZDM0ODU0OTViMjljZGYxYzRkYTQyOSIsInVzZXJfaWQiOjQxNCwicmVmcmVzaF9zaGlmdCI6MTIwLCJ1dWlkIjoiNWE1Zjg1OTBmYWM1NDBhOGJlYzI1ZTY0MmEzNDIzYTEifQ.8mT8OpNu6Kw3FigBLwt41owsUC3HGiI1J0ZpSdPzHl4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwNzUxNDIyMCwianRpIjoiNzQ1NDQ2NTc0ZTMyNDc0Mzg3MTY0NWQ0ZTk3ZjlkM2MiLCJ1c2VyX2lkIjo0MTQsInJlZnJlc2hfc2hpZnQiOjEyMCwidXVpZCI6IjVhNWY4NTkwZmFjNTQwYThiZWMyNWU2NDJhMzQyM2ExIn0.hwzaRXTAzlryzbK72XW3izl-ZoYRoBdVlXhp-mRNHL8',	'{\"id\":414,\"jackpots_won\":[],\"is_email_verified\":true,\"info\":{\"first_name\":\"lucas\",\"last_name\":\"lucas\",\"date_of_birth\":null,\"mobile_number\":\"\",\"country\":\"\",\"city\":\"\",\"street_address\":\"\",\"postal_code\":\"\",\"state\":null},\"bonus_balance\":\"0.00\",\"balance\":\"7.89\",\"role\":\"PA\",\"email\":\"luquin@gmail.com\",\"is_withdraw_allowed\":true,\"is_banned\":false,\"access\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA3NTExMjIwLCJqdGkiOiJhNTBmOThlYzMwZDM0ODU0OTViMjljZGYxYzRkYTQyOSIsInVzZXJfaWQiOjQxNCwicmVmcmVzaF9zaGlmdCI6MTIwLCJ1dWlkIjoiNWE1Zjg1OTBmYWM1NDBhOGJlYzI1ZTY0MmEzNDIzYTEifQ.8mT8OpNu6Kw3FigBLwt41owsUC3HGiI1J0ZpSdPzHl4\",\"refresh\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwNzUxNDIyMCwianRpIjoiNzQ1NDQ2NTc0ZTMyNDc0Mzg3MTY0NWQ0ZTk3ZjlkM2MiLCJ1c2VyX2lkIjo0MTQsInJlZnJlc2hfc2hpZnQiOjEyMCwidXVpZCI6IjVhNWY4NTkwZmFjNTQwYThiZWMyNWU2NDJhMzQyM2ExIn0.hwzaRXTAzlryzbK72XW3izl-ZoYRoBdVlXhp-mRNHL8\",\"last_login\":\"2024-02-09T20:30:20.970147Z\",\"username\":\"luquin\",\"first_name\":\"\",\"last_name\":\"\",\"date_joined\":\"2023-11-15T16:52:59.768862Z\",\"balance_currency\":\"MXN\",\"bonus_balance_currency\":\"MXN\",\"is_self_registered\":false,\"language\":\"en-US\",\"needs_document_approve\":true,\"affise_data\":null,\"pap_data\":null,\"cpf_document\":null,\"parent\":3}',	'2024-02-09 20:30:21.172',	'2024-02-09 20:30:21.172',	0);
