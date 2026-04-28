 -- Tabla de clientes
CREATE TABLE "202030851_clientes" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE
);

-- Tabla de productos
CREATE TABLE "202030851_productos" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL
);

-- Tabla de pedidos
CREATE TABLE "202030851_pedidos" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    fecha TEXT,
    FOREIGN KEY (cliente_id) REFERENCES "202030851_clientes"(id)
);

-- Tabla de detalle de pedidos
CREATE TABLE "202030851_detalle_pedido" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER,
    FOREIGN KEY (pedido_id) REFERENCES "202030851_pedidos"(id),
    FOREIGN KEY (producto_id) REFERENCES "202030851_productos"(id)
);


INSERT INTO "202030851_clientes" (nombre, correo) VALUES
('Juan Perez', 'juan@email.com'),
('Maria Lopez', 'maria@email.com'),
('Carlos Gomez', 'carlos@email.com'),
('Ana Torres', 'ana@email.com'),
('Luis Ramirez', 'luis@email.com');

INSERT INTO "202030851_productos" (nombre, precio) VALUES
('Laptop', 800.50),
('Mouse', 15.00),
('Teclado', 25.00),
('Monitor', 150.75),
('USB', 10.00);

INSERT INTO "202030851_pedidos" (cliente_id, fecha) VALUES
(1, '2026-04-27'),
(2, '2026-04-26'),
(3, '2026-04-25'),
(4, '2026-04-24'),
(5, '2026-04-23');

INSERT INTO "202030851_detalle_pedido" (pedido_id, producto_id, cantidad) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1),
(3, 4, 1),
(4, 5, 3);

-- 1. Cambiar nombre de cliente
UPDATE "202030851_clientes"
SET nombre = 'Juan Actualizado'
WHERE id = 1;

-- 2. Cambiar precio de producto
UPDATE "202030851_productos"
SET precio = 900.00
WHERE id = 1;

-- 3. Cambiar cantidad en detalle
UPDATE "202030851_detalle_pedido"
SET cantidad = 5
WHERE id = 2;



SELECT * FROM "202030851_clientes";
SELECT * FROM "202030851_detalle_pedido";
SELECT * FROM "202030851_detalle_pedido";