-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2023 at 08:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cloud-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ambiente`
--

CREATE TABLE `ambiente` (
  `id` int(11) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `capacidad` int(11) NOT NULL,
  `deshabilitado` char(2) NOT NULL,
  `activo` char(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ambiente`
--

INSERT INTO `ambiente` (`id`, `id_tipo`, `nombre`, `ubicacion`, `descripcion`, `capacidad`, `deshabilitado`, `activo`) VALUES
(1, 2, '692F', 'Edificio Nuevo', '', 60, 'si', 'si'),
(2, 2, '617C', 'Frente al departamento de Fisica', '', 70, 'no', 'si'),
(3, 2, '622F', 'Bloque central', '', 90, 'no', 'si'),
(4, 2, '617A', 'Frente al departamento de Fisica', '', 22, 'no', 'si'),
(5, 2, '693A', 'Edificio \"nuevo\" 3er Piso', '', 80, 'no', 'si'),
(6, 2, '693B', 'Edificio \"nuevo\" 3er Piso', '', 90, 'no', 'si'),
(7, 2, '612', 'Trencito', '', 50, 'no', 'si'),
(8, 2, '623', 'Bloque central', '', 70, 'no', 'si'),
(11, 2, '690A', 'Edificio \"nuevo\" Planta Baja', '', 40, 'no', 'si'),
(12, 2, '622', 'Bloque central', '', 80, 'no', 'si'),
(13, 2, '607', 'Trencito', '', 60, 'no', 'si');

-- --------------------------------------------------------

--
-- Table structure for table `estado`
--

CREATE TABLE `estado` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estado`
--

INSERT INTO `estado` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Aceptado', 'Indica que una reserva fue aceptada'),
(2, 'Pendiente', 'Indica que la reserva esta en proceso de revisión'),
(3, 'Rechazado', 'Indica que la reserva ha sido rechazada');

-- --------------------------------------------------------

--
-- Table structure for table `facilidad`
--

CREATE TABLE `facilidad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilidad`
--

INSERT INTO `facilidad` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Data Display', NULL),
(2, 'Televisión', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `facilidades`
--

CREATE TABLE `facilidades` (
  `id_ambiente` int(11) NOT NULL,
  `id_facilidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilidades`
--

INSERT INTO `facilidades` (`id_ambiente`, `id_facilidad`) VALUES
(1, 2),
(2, 1),
(4, 1),
(4, 2),
(5, 1),
(5, 2),
(11, 1),
(12, 1),
(13, 2);

-- --------------------------------------------------------

--
-- Table structure for table `grupos`
--

CREATE TABLE `grupos` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grupos`
--

INSERT INTO `grupos` (`id`, `name`) VALUES
(1, 'administrador'),
(2, 'docente');

-- --------------------------------------------------------

--
-- Table structure for table `periodos`
--

CREATE TABLE `periodos` (
  `id` int(11) NOT NULL,
  `inicia` time NOT NULL,
  `termina` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periodos`
--

INSERT INTO `periodos` (`id`, `inicia`, `termina`) VALUES
(1, '06:45:00', '07:30:00'),
(2, '07:30:00', '08:15:00'),
(3, '08:15:00', '09:00:00'),
(4, '09:00:00', '09:45:00'),
(5, '09:45:00', '10:30:00'),
(6, '10:30:00', '11:15:00'),
(7, '11:15:00', '12:00:00'),
(8, '12:00:00', '12:45:00'),
(9, '12:45:00', '13:30:00'),
(10, '13:30:00', '14:15:00'),
(11, '14:15:00', '15:00:00'),
(12, '15:00:00', '15:45:00'),
(13, '15:45:00', '16:30:00'),
(14, '16:30:00', '17:15:00'),
(15, '17:15:00', '18:00:00'),
(16, '18:00:00', '18:45:00'),
(17, '18:45:00', '19:30:00'),
(18, '19:30:00', '20:15:00'),
(19, '20:15:00', '21:00:00'),
(20, '21:00:00', '21:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `id_ambiente` int(11) NOT NULL,
  `id_periodo` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_reserva` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservas`
--

INSERT INTO `reservas` (`id`, `id_ambiente`, `id_periodo`, `id_estado`, `fecha_agregado`, `fecha_reserva`) VALUES
(2, 2, 1, 2, '2023-12-19 05:12:44', '2023-12-19'),
(3, 3, 1, 2, '2023-12-19 05:23:27', '2023-12-19');

-- --------------------------------------------------------

--
-- Table structure for table `tipo`
--

CREATE TABLE `tipo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo`
--

INSERT INTO `tipo` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Auditorio', NULL),
(2, 'Aula', NULL),
(3, 'Biblioteca', NULL),
(4, 'Comedor', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_grupo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ambiente`
--
ALTER TABLE `ambiente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `id_tipo` (`id_tipo`);

--
-- Indexes for table `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facilidad`
--
ALTER TABLE `facilidad`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facilidades`
--
ALTER TABLE `facilidades`
  ADD PRIMARY KEY (`id_ambiente`,`id_facilidad`),
  ADD KEY `id_facilidad` (`id_facilidad`);

--
-- Indexes for table `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `periodos`
--
ALTER TABLE `periodos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ambiente` (`id_ambiente`),
  ADD KEY `id_periodo` (`id_periodo`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indexes for table `tipo`
--
ALTER TABLE `tipo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_grupo` (`id_grupo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ambiente`
--
ALTER TABLE `ambiente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `estado`
--
ALTER TABLE `estado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `facilidad`
--
ALTER TABLE `facilidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `grupos`
--
ALTER TABLE `grupos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `periodos`
--
ALTER TABLE `periodos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tipo`
--
ALTER TABLE `tipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ambiente`
--
ALTER TABLE `ambiente`
  ADD CONSTRAINT `ambiente_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipo` (`id`);

--
-- Constraints for table `facilidades`
--
ALTER TABLE `facilidades`
  ADD CONSTRAINT `facilidades_ibfk_1` FOREIGN KEY (`id_facilidad`) REFERENCES `facilidad` (`id`),
  ADD CONSTRAINT `facilidades_ibfk_2` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id`);

--
-- Constraints for table `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_periodo`) REFERENCES `periodos` (`id`),
  ADD CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id`);

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
