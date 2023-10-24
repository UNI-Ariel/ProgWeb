CREATE TABLE `ambiente` (
  `id_ambiente` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_estado` integer NOT NULL,
  `id_tipo` integer NOT NULL,
  `nombre` varchar(255) UNIQUE NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `descripcion` varchar(255),
  `capacidad` integer NOT NULL,
  `activo` boolean NOT NULL
);

CREATE TABLE `estado` (
  `id_estado` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) UNIQUE NOT NULL,
  `descripcion` varchar(255) NOT NULL
);

CREATE TABLE `tipo` (
  `id_tipo` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) UNIQUE NOT NULL,
  `descripcion` varchar(255) NOT NULL
);

CREATE TABLE `facilidad` (
  `id_facilidad` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) UNIQUE NOT NULL,
  `descripcion` varchar(255) NOT NULL
);

CREATE TABLE `facilidades` (
  `id_ambiente` integer NOT NULL,
  `id_facilidad` integer NOT NULL,
  `detalles` varchar(255),
  PRIMARY KEY (`id_ambiente`, `id_facilidad`)
);

ALTER TABLE `ambiente` ADD FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id_estado`);

ALTER TABLE `ambiente` ADD FOREIGN KEY (`id_tipo`) REFERENCES `tipo` (`id_tipo`);

ALTER TABLE `facilidades` ADD FOREIGN KEY (`id_facilidad`) REFERENCES `facilidad` (`id_facilidad`);

ALTER TABLE `facilidades` ADD FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`);
