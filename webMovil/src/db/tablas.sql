-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 08, 2023 at 01:37 PM
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
  `id_ambiente` int(11) NOT NULL,
  `id_tipo` varchar(64) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `capacidad` int(11) NOT NULL,
  `deshabilitado` char(2) NOT NULL,
  `activo` char(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ambiente`
--

INSERT INTO `ambiente` (`id_ambiente`, `id_tipo`, `nombre`, `ubicacion`, `descripcion`, `capacidad`, `deshabilitado`, `activo`) VALUES
(1, 'aula', '692F', 'Edificio \"nuevo\"', '', 60, 'no', 'si'),
(2, 'aula', '617C', 'Bloque central, Frente al departemento de Fisica', 'Aula', 70, 'no', 'si');

-- --------------------------------------------------------

--
-- Table structure for table `estado`
--

CREATE TABLE `estado` (
  `id_estado` char(1) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estado`
--

INSERT INTO `estado` (`id_estado`, `descripcion`) VALUES
('A', 'Aceptado'),
('P', 'Pendiente'),
('R', 'Rechazado');

-- --------------------------------------------------------

--
-- Table structure for table `facilidad`
--

CREATE TABLE `facilidad` (
  `id_facilidad` varchar(64) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilidad`
--

INSERT INTO `facilidad` (`id_facilidad`, `descripcion`) VALUES
('data display', 'Herramienta para visualizar la pantalla del computador en la pared.'),
('television', 'Herramienta para conectar y ver la pantalla del computador en la television.');

-- --------------------------------------------------------

--
-- Table structure for table `facilidades`
--

CREATE TABLE `facilidades` (
  `id_ambiente` int(11) NOT NULL,
  `id_facilidad` varchar(64) NOT NULL,
  `detalles` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `periodos`
--

CREATE TABLE `periodos` (
  `id_periodo` int(11) NOT NULL,
  `hora_ini` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periodos`
--

INSERT INTO `periodos` (`id_periodo`, `hora_ini`, `hora_fin`) VALUES
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
  `id_reserva` int(11) NOT NULL,
  `id_ambiente` int(11) NOT NULL,
  `id_periodo` int(11) NOT NULL,
  `id_estado` char(1) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_reserva` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tipo`
--

CREATE TABLE `tipo` (
  `id_tipo` varchar(64) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo`
--

INSERT INTO `tipo` (`id_tipo`, `descripcion`) VALUES
('auditorio', 'Lugar amplio con mucha capacidad, optimo para dar examenes.'),
('aula', 'Lugar donde se da clases a los estudiantes.'),
('biblioteca', 'Lugar donde estudiar y obtener material bibliografico.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ambiente`
--
ALTER TABLE `ambiente`
  ADD PRIMARY KEY (`id_ambiente`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `id_tipo` (`id_tipo`);

--
-- Indexes for table `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indexes for table `facilidad`
--
ALTER TABLE `facilidad`
  ADD PRIMARY KEY (`id_facilidad`);

--
-- Indexes for table `facilidades`
--
ALTER TABLE `facilidades`
  ADD PRIMARY KEY (`id_ambiente`,`id_facilidad`),
  ADD KEY `id_facilidad` (`id_facilidad`);

--
-- Indexes for table `periodos`
--
ALTER TABLE `periodos`
  ADD PRIMARY KEY (`id_periodo`);

--
-- Indexes for table `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `id_ambiente` (`id_ambiente`),
  ADD KEY `id_periodo` (`id_periodo`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indexes for table `tipo`
--
ALTER TABLE `tipo`
  ADD PRIMARY KEY (`id_tipo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ambiente`
--
ALTER TABLE `ambiente`
  MODIFY `id_ambiente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `periodos`
--
ALTER TABLE `periodos`
  MODIFY `id_periodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ambiente`
--
ALTER TABLE `ambiente`
  ADD CONSTRAINT `ambiente_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipo` (`id_tipo`);

--
-- Constraints for table `facilidades`
--
ALTER TABLE `facilidades`
  ADD CONSTRAINT `facilidades_ibfk_1` FOREIGN KEY (`id_facilidad`) REFERENCES `facilidad` (`id_facilidad`),
  ADD CONSTRAINT `facilidades_ibfk_2` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`);

--
-- Constraints for table `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_ambiente`) REFERENCES `ambiente` (`id_ambiente`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_periodo`) REFERENCES `periodos` (`id_periodo`),
  ADD CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estado` (`id_estado`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
