-- LoyalSight — Données fictives de test (10 clients français)

TRUNCATE TABLE transactions, demandes_rgpd, points, clients RESTART IDENTITY CASCADE;

INSERT INTO clients (nom, prenom, email, telephone, date_naissance, date_inscription, segment, actif, anonymise) VALUES
('Dupont',    'Jean',      'jean.dupont@email.fr',      '0612345678', '1985-03-15', '2020-01-10 09:00:00', 'PLATINUM', TRUE,  FALSE),
('Martin',    'Marie',     'marie.martin@email.fr',     '0623456789', '1990-07-22', '2020-03-05 10:30:00', 'GOLD',     TRUE,  FALSE),
('Leroy',     'Sophie',    'sophie.leroy@email.fr',     '0634567890', '1978-11-30', '2020-06-15 14:00:00', 'GOLD',     TRUE,  FALSE),
('Moreau',    'Pierre',    'pierre.moreau@email.fr',    '0645678901', '1995-04-08', '2021-01-20 11:00:00', 'SILVER',   TRUE,  FALSE),
('Bernard',   'Isabelle',  'isabelle.bernard@email.fr', '0656789012', '1982-09-12', '2021-05-10 16:00:00', 'SILVER',   TRUE,  FALSE),
('Petit',     'Thomas',    'thomas.petit@email.fr',     '0667890123', '2000-01-25', '2022-02-14 09:30:00', 'STANDARD', TRUE,  FALSE),
('Rousseau',  'Celine',    'celine.rousseau@email.fr',  '0678901234', '1993-06-18', '2022-08-01 13:00:00', 'STANDARD', TRUE,  FALSE),
('Fournier',  'Nicolas',   'nicolas.fournier@email.fr', '0689012345', '1975-12-03', '2019-11-05 08:00:00', 'PLATINUM', TRUE,  FALSE),
('Girard',    'Lucie',     'lucie.girard@email.fr',     '0690123456', '1988-08-20', '2021-09-25 15:00:00', 'SILVER',   TRUE,  FALSE),
('Dubois',    'Alexandre', 'alexandre.dubois@email.fr', NULL,         '1970-05-15', '2020-11-30 12:00:00', 'GOLD',     TRUE,  FALSE);

INSERT INTO points (client_id, points_cumules, points_disponibles, points_utilises, derniere_mise_a_jour) VALUES
(1,  12500, 10000, 2500, '2024-01-15 10:00:00'),
(2,  7800,  6500,  1300, '2024-01-10 14:00:00'),
(3,  5200,  4800,  400,  '2024-01-08 11:00:00'),
(4,  3400,  3000,  400,  '2024-01-05 16:00:00'),
(5,  1800,  1500,  300,  '2024-01-03 09:00:00'),
(6,  650,   650,   0,    '2024-01-01 12:00:00'),
(7,  120,   120,   0,    '2023-12-20 10:00:00'),
(8,  18000, 15000, 3000, '2024-01-14 08:00:00'),
(9,  2900,  2600,  300,  '2024-01-12 13:00:00'),
(10, 9100,  8000,  1100, '2024-01-11 15:00:00');

INSERT INTO transactions (client_id, type, points, montant, description, date_transaction) VALUES
(1,  'ACHAT',       500,   85.50,  'Courses du mois',             '2024-01-05 10:30:00'),
(1,  'ACHAT',       1200,  210.00, 'Achat plats surgeles',        '2024-01-10 14:00:00'),
(1,  'UTILISATION', -2500, NULL,   'Bon de reduction 25 euros',   '2024-01-15 10:00:00'),
(2,  'ACHAT',       800,   140.00, 'Commande en ligne',           '2024-01-08 09:00:00'),
(2,  'ACHAT',       500,   90.00,  'Courses semaine',             '2024-01-10 14:00:00'),
(2,  'UTILISATION', -1300, NULL,   'Remise fidelite',             '2024-01-12 16:00:00'),
(3,  'ACHAT',       900,   160.00, 'Achat mensuel',               '2024-01-06 11:00:00'),
(3,  'ACHAT',       300,   55.00,  'Produits surgeles',           '2024-01-08 14:00:00'),
(3,  'UTILISATION', -400,  NULL,   'Recompense fidelite',         '2024-01-09 10:00:00'),
(4,  'ACHAT',       700,   120.00, 'Courses bimensuelles',        '2024-01-03 12:00:00'),
(4,  'ACHAT',       200,   38.00,  'Appoint semaine',             '2024-01-05 16:00:00'),
(4,  'UTILISATION', -400,  NULL,   'Bon cadeau',                  '2024-01-06 09:00:00'),
(5,  'ACHAT',       400,   70.00,  'Commande hebdo',              '2024-01-01 10:00:00'),
(5,  'ACHAT',       200,   35.00,  'Complement courses',          '2024-01-03 09:00:00'),
(5,  'UTILISATION', -300,  NULL,   'Remise panier',               '2024-01-04 14:00:00'),
(6,  'ACHAT',       300,   52.00,  'Premiere commande',           '2023-12-28 11:00:00'),
(6,  'ACHAT',       350,   62.00,  'Courses janvier',             '2024-01-01 12:00:00'),
(7,  'ACHAT',       120,   22.00,  'Test programme fidelite',     '2023-12-20 10:00:00'),
(8,  'ACHAT',       2000,  350.00, 'Grande commande mensuelle',   '2024-01-10 08:00:00'),
(8,  'ACHAT',       1500,  265.00, 'Reassort surgeles',           '2024-01-12 14:00:00'),
(8,  'UTILISATION', -3000, NULL,   'Recompense platinum',         '2024-01-14 08:00:00'),
(9,  'ACHAT',       600,   105.00, 'Achat bi-mensuel',            '2024-01-08 13:00:00'),
(9,  'ACHAT',       350,   62.00,  'Complement courses',          '2024-01-10 15:00:00'),
(9,  'UTILISATION', -300,  NULL,   'Bon de reduction',            '2024-01-12 09:00:00'),
(10, 'ACHAT',       1500,  260.00, 'Commande mensuelle',          '2024-01-05 15:00:00'),
(10, 'ACHAT',       800,   140.00, 'Achat special',               '2024-01-08 11:00:00'),
(10, 'UTILISATION', -1100, NULL,   'Utilisation points gold',     '2024-01-11 15:00:00');
