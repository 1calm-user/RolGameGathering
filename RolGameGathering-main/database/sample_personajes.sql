USE rol_game_db;

-- Ejemplos básicos de personajes
INSERT INTO characters (race, char_name, char_weight, objects, abilities, dexterity) VALUES
('Elfo', 'Legolas', 70.5, 'Arco y Flechas', 'Vista élfica: puede ver a grandes distancias con claridad', 95),
('Enano', 'Gimli', 82.3, 'Hacha y Escudo', 'Resistencia pétrea: reduce el daño físico recibido', 75),
('Humano', 'Aragorn', 85.0, 'Espada y Daga', 'Liderazgo: mejora las habilidades de los aliados cercanos', 88),
('Troll', 'Grug', 150.2, 'Garrote y Piedras', 'Fuerza hercúlea: puede levantar objetos extremadamente pesados', 45),
('Elfo', 'Arwen', 65.8, 'Espada y Brújula', 'Sanación élfica: puede curar heridas leves', 85);