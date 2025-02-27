-- Crear tabla si no existe
CREATE DATABASE IF NOT EXISTS rol_game_db;
USE rol_game_db;

-- Crear tabla de personajes
CREATE TABLE IF NOT EXISTS characters (
    char_id INT AUTO_INCREMENT PRIMARY KEY,
    race VARCHAR(50) NOT NULL,
    char_name VARCHAR(100) NOT NULL,
    char_weight DECIMAL(5,2),
    objects VARCHAR(255),
    abilities TEXT,
    dexterity INT CHECK (dexterity >= 0 AND dexterity <= 100)
);