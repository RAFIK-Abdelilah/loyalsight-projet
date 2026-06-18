-- LoyalSight — Initialisation de la base de données

CREATE TABLE IF NOT EXISTS clients (
    id               SERIAL PRIMARY KEY,
    nom              VARCHAR(100) NOT NULL,
    prenom           VARCHAR(100) NOT NULL,
    email            VARCHAR(150) UNIQUE NOT NULL,
    telephone        VARCHAR(20),
    date_naissance   DATE,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    segment          VARCHAR(50) DEFAULT 'STANDARD',
    actif            BOOLEAN DEFAULT TRUE,
    anonymise        BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS points (
    id                   SERIAL PRIMARY KEY,
    client_id            INTEGER REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    points_cumules       INTEGER DEFAULT 0,
    points_disponibles   INTEGER DEFAULT 0,
    points_utilises      INTEGER DEFAULT 0,
    derniere_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id               SERIAL PRIMARY KEY,
    client_id        INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    type             VARCHAR(50),
    points           INTEGER NOT NULL,
    montant          NUMERIC(10,2),
    description      VARCHAR(255),
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS demandes_rgpd (
    id              SERIAL PRIMARY KEY,
    client_id       INTEGER REFERENCES clients(id),
    type_demande    VARCHAR(50),
    statut          VARCHAR(50) DEFAULT 'EN_ATTENTE',
    date_demande    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_traitement TIMESTAMP
);

CREATE OR REPLACE VIEW vue_qualite_donnees AS
SELECT
    COUNT(*)                                                    AS total_clients,
    COUNT(*) FILTER (WHERE email IS NULL OR email = '')         AS emails_manquants,
    COUNT(*) FILTER (WHERE telephone IS NULL OR telephone = '') AS telephones_manquants,
    COUNT(*) FILTER (WHERE date_naissance IS NULL)              AS dates_naissance_manquantes,
    COUNT(*) FILTER (WHERE actif = TRUE)                        AS clients_actifs,
    COUNT(*) FILTER (WHERE anonymise = TRUE)                    AS clients_anonymises,
    (
        SELECT COUNT(*)
        FROM (
            SELECT email FROM clients GROUP BY email HAVING COUNT(*) > 1
        ) doublons
    )                                                           AS doublons_email
FROM clients;
