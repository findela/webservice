-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 10, 2019 at 08:52 PM
-- Server version: 5.7.27-0ubuntu0.18.04.1
-- PHP Version: 7.1.32-1+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app-water`
--

-- --------------------------------------------------------

--
-- Table structure for table `locators`
--

CREATE TABLE `locators` (
  `id` int(11) NOT NULL,
  `location_name` varchar(300) NOT NULL,
  `like_count` int(5) NOT NULL,
  `geolocation` text NOT NULL,
  `pattern` enum('SQUARE','OVAL','CIRCLE','OTHER') NOT NULL,
  `width` float(10,5) NOT NULL,
  `height` float(10,5) NOT NULL,
  `depth` float(10,5) NOT NULL,
  `calculate_in` enum('FEET','METER') NOT NULL,
  `user_id` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `locators`
--

INSERT INTO `locators` (`id`, `location_name`, `like_count`, `geolocation`, `pattern`, `width`, `height`, `depth`, `calculate_in`, `user_id`, `status`, `created_at`) VALUES
(1, 'Hello', 0, 'sadasd', 'SQUARE', 200.00000, 200.00000, 20.00000, 'FEET', 1, 1, '2019-09-10 14:23:08'),
(2, 'Hello', 0, 'sssss', 'SQUARE', 200.00000, 200.00000, 20.00000, 'FEET', 1, 1, '2019-09-10 14:23:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `first_name` varchar(200) NOT NULL,
  `last_name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `user_type` enum('CUSTOMER','ADMIN','DEVELOPER','OTHERS') NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `user_type`, `status`, `created_at`) VALUES
(1, 'Hello', 'Seso', 'email@gmail.com', 'Seso', 'CUSTOMER', 1, '2019-09-10 14:54:31'),
(2, 'Hello', 'Seso', 'email@gmail.com', 'Seso', 'ADMIN', 1, '2019-09-10 15:02:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `locators`
--
ALTER TABLE `locators`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `locators`
--
ALTER TABLE `locators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `locators`
--
ALTER TABLE `locators`
  ADD CONSTRAINT `locators_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
