CREATE TABLE `ambiente` (
  `id_ambiente` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_tipo` varchar(64) NOT NULL,
  `nombre` varchar(64) UNIQUE NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `descripcion` varchar(255),
  `capacidad` integer NOT NULL,
  `deshabilitado` char(2) NOT NULL,
  `activo` char(2) NOT NULL
);

CREATE TABLE `tipo` (
  `id_tipo` varchar(64) PRIMARY KEY NOT NULL,
  `descripcion` varchar(255) NOT NULL
);

CREATE TABLE `facilidad` (
  `id_facilidad` varchar(64) PRIMARY KEY NOT NULL,
  `descripcion` varchar(255) NOT NULL
);

CREATE TABLE `facilidades` (
  `id_ambiente` integer NOT NULL,
  `id_facilidad` varchar(64) NOT NULL,
  `detalles` varchar(255),
  PRIMARY KEY (`id_ambiente`, `id_facilidad`)
);

ALTER TABLE `ambiente` ADD FOREIGN KEY (`id_tipo`) REFERENCES `tipo` (`id_tipo`);

ALTER TABLE `facilidades` ADD FOREIGN KEY (`id_facilidad`) REFERENCES `facilidad` (`id_facilidad`);

ALTER TABLE `facilidades` ADD FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`);
