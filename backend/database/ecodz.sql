-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 26 jan. 2026 à 23:57
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecodz`
--

-- --------------------------------------------------------

--
-- Structure de la table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL,
  `deal_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `seats` int(11) NOT NULL DEFAULT 1,
  `status` enum('PENDING','CONFIRMED','COMPLETED','CANCELLED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `attendance_code` char(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `comment_type` varchar(50) NOT NULL,
  `destination_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment_text` longtext NOT NULL,
  `likes` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comment_replies`
--

CREATE TABLE `comment_replies` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `reply_text` longtext NOT NULL,
  `likes` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `last_message_at` datetime DEFAULT current_timestamp(),
  `trip_id` int(11) NOT NULL,
  `user_low` int(11) GENERATED ALWAYS AS (least(`user1_id`,`user2_id`)) STORED,
  `user_high` int(11) GENERATED ALWAYS AS (greatest(`user1_id`,`user2_id`)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversations`
--

INSERT INTO `conversations` (`id`, `user1_id`, `user2_id`, `created_at`, `last_message_at`, `trip_id`) VALUES
(5, 3, 5, '2026-01-07 17:59:48', '2026-01-18 11:51:46', 0),
(6, 3, 6, '2026-01-14 16:45:45', '2026-01-14 16:46:34', 0),
(7, 3, 7, '2026-01-17 10:08:11', '2026-01-17 10:09:14', 0);

-- --------------------------------------------------------

--
-- Structure de la table `deals_bookings`
--

CREATE TABLE `deals_bookings` (
  `id` int(11) NOT NULL,
  `deal_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `seats` int(11) NOT NULL DEFAULT 1,
  `status` enum('PENDING','CONFIRMED','COMPLETED','CANCELLED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `attendance_code` char(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

CREATE TABLE `favorites` (
  `user_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message_text` longtext NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `receiver_id`, `message_text`, `is_read`, `read_at`, `created_at`) VALUES
(14, 5, 5, 3, 'ahlaaa', 1, '2026-01-07 18:01:20', '2026-01-07 17:59:53'),
(15, 5, 5, 3, 'wch raak', 1, '2026-01-07 18:01:20', '2026-01-07 18:00:00'),
(16, 5, 3, 5, 'bkirr hbb wnta', 1, '2026-01-07 18:02:05', '2026-01-07 18:01:29'),
(17, 5, 5, 3, 'w9tah trouho', 1, '2026-01-07 18:03:15', '2026-01-07 18:03:04'),
(18, 5, 3, 5, 'ahlaaa', 1, '2026-01-12 16:23:29', '2026-01-12 16:04:03'),
(19, 5, 3, 5, 'ahdr aa', 1, '2026-01-12 16:23:29', '2026-01-12 16:17:27'),
(20, 5, 5, 3, 'aah', 1, '2026-01-12 20:41:52', '2026-01-12 20:41:33'),
(21, 6, 6, 3, 'hello ', 1, '2026-01-14 16:46:31', '2026-01-14 16:45:53'),
(22, 6, 3, 6, 'hii', 0, NULL, '2026-01-14 16:46:34'),
(23, 5, 5, 3, 'hehehe', 1, '2026-01-14 17:01:05', '2026-01-14 16:57:20'),
(24, 5, 5, 3, 'hhoho', 1, '2026-01-14 17:01:05', '2026-01-14 16:57:28'),
(25, 5, 3, 5, 'nigga', 1, '2026-01-17 03:23:46', '2026-01-16 17:29:29'),
(26, 5, 3, 5, 'f', 1, '2026-01-17 03:23:46', '2026-01-16 17:30:25'),
(27, 5, 3, 5, '.....', 1, '2026-01-17 03:23:46', '2026-01-16 23:26:06'),
(28, 5, 3, 5, 'ddddd', 1, '2026-01-17 03:23:46', '2026-01-16 23:26:21'),
(29, 5, 3, 5, 'a', 1, '2026-01-17 03:23:46', '2026-01-16 23:30:11'),
(30, 5, 3, 5, 'b', 1, '2026-01-17 03:23:46', '2026-01-16 23:31:42'),
(31, 5, 3, 5, 'c', 1, '2026-01-17 03:23:46', '2026-01-16 23:36:00'),
(32, 5, 3, 5, 'nigga', 1, '2026-01-17 03:23:46', '2026-01-16 23:36:15'),
(33, 5, 3, 5, 'fuck', 1, '2026-01-17 03:23:46', '2026-01-16 23:36:28'),
(34, 5, 3, 5, '.', 1, '2026-01-17 03:23:46', '2026-01-16 23:36:58'),
(35, 5, 3, 5, 'hi', 1, '2026-01-17 03:23:46', '2026-01-16 23:38:16'),
(36, 5, 3, 5, ',', 1, '2026-01-17 03:23:46', '2026-01-16 23:39:38'),
(37, 5, 3, 5, 'l', 1, '2026-01-17 03:23:46', '2026-01-16 23:39:42'),
(38, 5, 3, 5, 'hi', 1, '2026-01-17 03:23:46', '2026-01-16 23:42:21'),
(39, 5, 3, 5, 'nigga', 1, '2026-01-17 03:23:46', '2026-01-16 23:42:26'),
(40, 5, 3, 5, 'hi', 1, '2026-01-17 03:23:46', '2026-01-16 23:46:09'),
(41, 5, 3, 5, 'hi', 1, '2026-01-17 03:23:46', '2026-01-16 23:52:34'),
(42, 5, 3, 5, 'niga', 1, '2026-01-17 03:23:46', '2026-01-16 23:52:44'),
(43, 5, 5, 3, 'aah', 1, '2026-01-20 20:16:21', '2026-01-17 03:24:21'),
(44, 5, 5, 3, 'ak bien', 1, '2026-01-20 20:16:21', '2026-01-17 03:24:29'),
(45, 7, 7, 3, 'ahla ', 1, '2026-01-17 10:09:08', '2026-01-17 10:08:18'),
(46, 7, 7, 3, 'cv', 1, '2026-01-17 10:09:08', '2026-01-17 10:08:36'),
(47, 7, 7, 3, 'dsfsas', 1, '2026-01-17 10:09:08', '2026-01-17 10:08:44'),
(48, 7, 3, 7, 'bien hmdlh', 0, NULL, '2026-01-17 10:09:14'),
(49, 5, 5, 3, 'ahla', 1, '2026-01-20 20:16:21', '2026-01-18 11:51:46');

-- --------------------------------------------------------

--
-- Structure de la table `places`
--

CREATE TABLE `places` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `destination` varchar(150) DEFAULT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lng` decimal(9,6) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `avg_rating` float DEFAULT 0,
  `physical_rating` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `slug` varchar(150) NOT NULL,
  `category` enum('desert','mountain','forest','lake','cave','beach','park','waterfall') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `places`
--

INSERT INTO `places` (`id`, `name`, `description`, `destination`, `lat`, `lng`, `location`, `image`, `avg_rating`, `physical_rating`, `created_at`, `slug`, `category`) VALUES
(8, 'Mount Chelia', 'Highest peak in the Aurès Mountains, popular for hiking and panoramic views.', 'Khenchela – Algeria', 35.430000, 7.150000, NULL, '/assets/destinations/Chelia_2.jpg', 0, 5, '2025-12-26 16:13:09', 'mount-chelia', 'mountain'),
(9, 'Tassili n\'Ajjer National Park', 'UNESCO World Heritage site famous for prehistoric rock art and sandstone formations.', 'Illizi – Algeria', 25.300000, 8.200000, NULL, '/assets/destinations/Tassili.avif', 0, 4, '2025-12-26 16:13:09', 'tassili-n-ajjer-national-park', 'desert'),
(10, 'Hoggar Mountains (Ahaggar)', 'Volcanic desert mountains with dramatic landscapes and Tuareg culture.', 'Tamanrasset – Algeria', 23.290000, 5.530000, NULL, '/assets/destinations/Alhaggar.jpg', 0, 4, '2025-12-26 16:13:09', 'hoggar-mountains-ahaggar', 'mountain'),
(11, 'Mount Tahat', 'The highest peak in Algeria, ideal for experienced climbers.', 'Hoggar – Algeria', 23.290000, 5.530000, NULL, '/assets/destinations/tahat.jfif', 0, 5, '2025-12-26 16:13:09', 'mount-tahat', 'mountain'),
(12, 'Chréa National Park', 'Mountain park known for cedar forests and Barbary macaques.', 'Blida – Algeria', 36.420000, 2.880000, NULL, '/assets/destinations/chrea.jpg', 0, 2, '2025-12-26 16:13:09', 'chrea-national-park', 'park'),
(13, 'Beni Haroun Dam & Lake', 'Largest dam reservoir in Algeria.', 'Mila – Algeria', 36.430000, 6.330000, NULL, '/assets/destinations/bni_haroun.jpg', 0, 1, '2025-12-26 16:13:09', 'beni-haroun-dam-lake', 'lake'),
(14, 'Zahlane Caves', 'Natural caves offering a calm underground experience.', 'Setif – Algeria', 36.190000, 5.410000, NULL, '/assets/destinations/Zahlane_Caves.jpg', 0, 2, '2025-12-26 16:13:09', 'zahlane-caves', 'cave'),
(15, 'Lac Oubeira', 'Scenic lake in El Kala National Park, great for birdwatching.', 'El Tarf – Algeria', 36.900000, 8.300000, NULL, '/assets/destinations/Lac_Oubeira.jpg', 0, 1, '2025-12-26 16:13:09', 'lac-oubeira', 'lake'),
(16, 'Sidi Fredj Coast', 'Popular beach destination near Algiers with clear waters.', 'Algiers – Algeria', 36.750000, 2.830000, NULL, '/assets/destinations/Sidi_Fredj.webp', 0, 1, '2025-12-26 16:13:09', 'sidi-fredj-coast', 'beach'),
(17, 'Atlas Cedar Forest in Mount Chelia', 'Dense cedar forest offering hiking trails and nature walks.', 'Khenchela – Algeria', 35.430000, 7.150000, NULL, '/assets/destinations/Atlas_Cedar_Forest.jpg', 0, 2, '2025-12-26 16:13:09', 'atlas-cedar-forest-mount-chelia', 'forest'),
(18, 'Hammam Meskhoutine', 'Famous hot springs and waterfalls with therapeutic properties.', 'Guelma – Algeria', 36.460000, 7.430000, NULL, '/assets/destinations/Hammam_Meskhoutine.webp', 0, 1, '2025-12-26 16:13:09', 'hammam-meskhoutine', 'waterfall'),
(20, 'Beni Salah Mountain', 'Scenic mountain known for its unique rock formations and hiking trails.', 'Oum El Bouaghi – Algeria', 35.870000, 7.110000, NULL, '/assets/destinations/Beni_Salah_Mountain.jpg', 0, 4, '2025-12-26 16:13:09', 'beni-salah-mountain', 'mountain'),
(21, 'Paysage dans le parc national de Chelia', 'Beautiful landscapes within Chelia National Park, ideal for nature lovers.', 'Khenchela – Algeria', 35.430000, 7.150000, NULL, '/assets/destinations/Paysage_dans_le_parc_national_de_chelia_1.jpg', 0, 2, '2026-01-05 14:29:21', 'paysage-parc-national-chelia', 'park');

-- --------------------------------------------------------

--
-- Structure de la table `place_comments`
--

CREATE TABLE `place_comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tour_name` varchar(150) DEFAULT NULL,
  `traveled_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `place_deals`
--

CREATE TABLE `place_deals` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_percentage` int(11) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','expired','disabled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(50) NOT NULL DEFAULT 'desert',
  `max_people` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `place_highlights`
--

CREATE TABLE `place_highlights` (
  `id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `place_ratings`
--

CREATE TABLE `place_ratings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `place_ratings`
--

INSERT INTO `place_ratings` (`id`, `user_id`, `place_id`, `rating`, `created_at`) VALUES
(170, 6, 9, 1, '2026-01-14 15:43:29'),
(171, 5, 9, 1, '2026-01-14 15:48:08'),
(172, 5, 18, 1, '2026-01-16 22:53:23');

-- --------------------------------------------------------

--
-- Structure de la table `place_reviews`
--

CREATE TABLE `place_reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `review` text NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `place_reviews`
--

INSERT INTO `place_reviews` (`id`, `user_id`, `place_id`, `review`, `rating`, `created_at`) VALUES
(48, 7, 18, 'nrohlha wn9olkm', 3, '2026-01-17 08:54:15'),
(49, 7, 18, 'wri trh', 5, '2026-01-17 08:59:49'),
(50, 7, 18, 'yla', 5, '2026-01-17 09:03:14'),
(51, 7, 18, 'it was a good place', 4, '2026-01-17 09:07:25');

-- --------------------------------------------------------

--
-- Structure de la table `place_review_images`
--

CREATE TABLE `place_review_images` (
  `id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `place_review_images`
--

INSERT INTO `place_review_images` (`id`, `review_id`, `image`, `created_at`) VALUES
(15, 48, 'review_7_1768640055780.JPG', '2026-01-17 08:54:15'),
(16, 49, 'review_7_1768640389498.png', '2026-01-17 08:59:49'),
(17, 51, 'review_7_1768640845561.jpg', '2026-01-17 09:07:25');

-- --------------------------------------------------------

--
-- Structure de la table `reply_likes`
--

CREATE TABLE `reply_likes` (
  `id` int(11) NOT NULL,
  `reply_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `review_reactions`
--

CREATE TABLE `review_reactions` (
  `id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('like','dislike') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `review_reactions`
--

INSERT INTO `review_reactions` (`id`, `review_id`, `user_id`, `type`, `created_at`) VALUES
(93, 26, 6, 'like', '2026-01-14 15:21:06'),
(97, 27, 6, 'like', '2026-01-14 15:44:56'),
(98, 27, 5, 'like', '2026-01-14 15:48:15'),
(99, 25, 3, 'like', '2026-01-15 09:44:26'),
(107, 27, 3, 'like', '2026-01-16 16:21:06'),
(108, 2147483647, 5, 'like', '2026-01-17 02:21:45'),
(110, 47, 5, 'like', '2026-01-17 02:22:36'),
(112, 47, 7, 'like', '2026-01-17 08:54:59'),
(113, 51, 7, 'like', '2026-01-17 09:07:39'),
(114, 50, 7, 'dislike', '2026-01-17 09:07:41');

-- --------------------------------------------------------

--
-- Structure de la table `review_replies`
--

CREATE TABLE `review_replies` (
  `id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `review_replies`
--

INSERT INTO `review_replies` (`id`, `review_id`, `user_id`, `text`, `created_at`) VALUES
(1, 26, 6, 'nigga\n', '2026-01-14 12:55:17'),
(2, 27, 5, 'shut ur mouth nigga', '2026-01-14 15:49:49'),
(3, 27, 3, 'nigga\n', '2026-01-16 16:00:05'),
(4, 27, 3, 'nogga', '2026-01-16 16:00:40'),
(5, 27, 3, 'ahaa\n', '2026-01-16 16:12:34'),
(6, 25, 3, 'nigga\n', '2026-01-16 16:32:28'),
(7, 47, 5, 'tmchi', '2026-01-17 02:22:43'),
(8, 47, 7, 'blassa mliha sah ?', '2026-01-17 08:53:52'),
(9, 51, 7, 'good', '2026-01-17 09:07:45');

-- --------------------------------------------------------

--
-- Structure de la table `searches`
--

CREATE TABLE `searches` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `support_messages`
--

CREATE TABLE `support_messages` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message_text` longtext NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'open',
  `priority` varchar(50) DEFAULT 'medium',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'desert',
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `duration` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `max_people` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved` tinyint(1) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `trips`
--

INSERT INTO `trips` (`id`, `organizer_id`, `place_id`, `category`, `title`, `description`, `start_date`, `end_date`, `duration`, `price`, `max_people`, `created_at`, `approved`, `image`) VALUES
(77, 3, 18, 'waterfall', 'guelma', 'yla guelma', '2026-02-01', '2026-02-03', 2, 2000.00, 10, '2026-01-17 09:05:53', 1, '[\"/uploads/trips/trip_3_1768640753509.png\"]'),
(78, 3, 17, 'forest', 'sea', 'ccccc', '2026-01-20', '2026-01-22', 2, 2000.00, 10, '2026-01-18 11:01:52', 1, '[\"/uploads/trips/trip_3_1768734112696.png\"]');

-- --------------------------------------------------------

--
-- Structure de la table `trip_attendance`
--

CREATE TABLE `trip_attendance` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL,
  `validated_by` int(11) NOT NULL,
  `checked_in_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isProfileCompleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(50) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `avatar`, `firstName`, `lastName`, `dateOfBirth`, `email`, `password`, `isProfileCompleted`, `created_at`, `phone`, `website`, `address`, `logo`, `description`, `verified`, `updated_at`, `role`) VALUES
(3, 'the wildlens', 'avatar_3_1767802357385.jpg', NULL, NULL, NULL, 'wild@gmail.com', '$2b$10$qkb3h7MGq5eJKPCJWCb.g.7jlrqZlU5Obj7ukz0bDnIdChpmL2UXG', 1, '2026-01-06 20:20:00', '0552055047', 'wild.com', '', 'logo_3_1767801469107.jpg', 'the wildlens mathafacka', 1, '2026-01-07 16:12:37', 'agency'),
(5, 'ahmedghoul', 'avatar_5_1768733467591.jpg', 'Ahmed', 'Ghoul', '2005-08-03', 'ahmed@gmail.com', '$2b$10$bmIylpY9PUiNmVV/BMuFc.dmpSOPH/2NrN3.INQwNMSHmczirg3RG', 1, '2026-01-07 16:52:13', NULL, NULL, NULL, NULL, NULL, 0, '2026-01-18 10:51:07', 'traveller'),
(6, 'islam0', 'avatar_6_1768384011867.jpg', 'islam', 'abdel', '2005-08-03', 'islam@gmail.com', '$2b$10$TsJ9UsNwzJe4cCTZRPCMbeHTriEHfe2teYcYLE8hXp9yMOTtk39O.', 1, '2026-01-14 09:24:06', NULL, NULL, NULL, NULL, NULL, 0, '2026-01-14 09:46:51', 'traveller'),
(7, 'traveller1', 'avatar_7_1768639914110.png', 'traveller', 'one', '2005-03-08', 'traveller1@gmail.com', '$2b$10$x8m/omfGIgOYWjGrb6VbHu/szKtLJfhbuGZ/XyW/ivjwaTzv9OAm2', 1, '2026-01-17 08:49:50', NULL, NULL, NULL, NULL, NULL, 0, '2026-01-17 08:51:54', 'traveller'),
(8, 'ahmed', 'avatar_8_1769249000568.jpg', 'ahmed', 'ghoul', '2005-03-08', '0ahmedghoul0@gmail.com', '$2b$10$.pniJIeIpFbXA71csw9n2.shfJ.bbfgm/hOS06rnsDr9D8ae0CZxm', 1, '2026-01-20 21:00:47', NULL, NULL, NULL, NULL, NULL, 0, '2026-01-24 10:03:20', 'traveller'),
(9, 'ahmed', NULL, NULL, NULL, NULL, '0ahmedghoulGA0@gmail.com', '$2b$10$zMbwglTVimx.rbAXAkMIKeb5zraS8Dj8YE.xQGyzNU1T69EZFKIw.', 0, '2026-01-26 10:18:19', NULL, NULL, NULL, NULL, NULL, 0, '2026-01-26 10:18:19', 'traveller'),
(10, 'wildlens', 'avatar_10_1769424330977.jpg', 'ahmed', 'ghoul', '2005-08-03', 'wildlen@gmail.com', '$2b$10$pWj1niW7ibVp.AKEpIiZqu271ZLfUc3QLat4T8HfWUmO1ffqNsjxG', 1, '2026-01-26 10:20:04', '+213 552 05 50 47', 'ga.com', '', NULL, 'sa[dpkasodp[kasd[psakd[pasd', 1, '2026-01-26 10:45:31', 'agency'),
(11, 'GAahmed', NULL, NULL, NULL, NULL, 'GAahmed@gmail.com', '$2b$10$CtANIUwEcQXIZMfhGqWRueI/eNTnGgaICXjgODyzE9.j09HkRu47a', 0, '2026-01-26 10:38:34', NULL, NULL, NULL, NULL, NULL, 0, '2026-01-26 10:38:34', 'traveller'),
(12, 'ahmedGA', NULL, NULL, NULL, NULL, 'ahmedGA@gmail.com', '$2b$10$sL/7pvOvsL7aU5L7BVRdIeeeOI0Hz.HOzmTIXPtTpubIs4e2HueNS', 0, '2026-01-26 10:44:55', NULL, NULL, NULL, NULL, NULL, 0, '2026-01-26 10:44:55', 'traveller');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_trip_attendance_code` (`trip_id`,`attendance_code`),
  ADD KEY `fk_bookings_user` (`user_id`);

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type_destination` (`comment_type`,`destination_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_comment_user` (`comment_id`,`user_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Index pour la table `comment_replies`
--
ALTER TABLE `comment_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_comment` (`comment_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_conversation` (`user1_id`,`user2_id`),
  ADD UNIQUE KEY `unique_trip_conversation` (`user1_id`,`user2_id`,`trip_id`),
  ADD KEY `idx_user1` (`user1_id`),
  ADD KEY `idx_user2` (`user2_id`);

--
-- Index pour la table `deals_bookings`
--
ALTER TABLE `deals_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_deals_bookings_deal` (`deal_id`),
  ADD KEY `fk_deals_bookings_user` (`user_id`);

--
-- Index pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`user_id`,`place_id`),
  ADD KEY `place_id` (`place_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversation` (`conversation_id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`);

--
-- Index pour la table `place_comments`
--
ALTER TABLE `place_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `place_id` (`place_id`);

--
-- Index pour la table `place_deals`
--
ALTER TABLE `place_deals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_place_deals_place` (`place_id`),
  ADD KEY `fk_place_deals_organizer` (`organizer_id`);

--
-- Index pour la table `place_highlights`
--
ALTER TABLE `place_highlights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `place_id` (`place_id`);

--
-- Index pour la table `place_ratings`
--
ALTER TABLE `place_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`place_id`),
  ADD UNIQUE KEY `unique_user_place` (`user_id`,`place_id`),
  ADD KEY `place_id` (`place_id`);

--
-- Index pour la table `place_reviews`
--
ALTER TABLE `place_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_place_id` (`place_id`);

--
-- Index pour la table `place_review_images`
--
ALTER TABLE `place_review_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `review_id` (`review_id`);

--
-- Index pour la table `reply_likes`
--
ALTER TABLE `reply_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_reply_user` (`reply_id`,`user_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Index pour la table `review_reactions`
--
ALTER TABLE `review_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_reaction` (`review_id`,`user_id`);

--
-- Index pour la table `review_replies`
--
ALTER TABLE `review_replies`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `searches`
--
ALTER TABLE `searches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_location` (`location`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `support_messages`
--
ALTER TABLE `support_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ticket` (`ticket_id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `place_id` (`place_id`),
  ADD KEY `trips_ibfk_1` (`organizer_id`);

--
-- Index pour la table `trip_attendance`
--
ALTER TABLE `trip_attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_booking_checkin` (`booking_id`),
  ADD KEY `idx_trip` (`trip_id`),
  ADD KEY `idx_validator` (`validated_by`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `comment_replies`
--
ALTER TABLE `comment_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `deals_bookings`
--
ALTER TABLE `deals_bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pour la table `places`
--
ALTER TABLE `places`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `place_comments`
--
ALTER TABLE `place_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT pour la table `place_deals`
--
ALTER TABLE `place_deals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `place_highlights`
--
ALTER TABLE `place_highlights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT pour la table `place_ratings`
--
ALTER TABLE `place_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT pour la table `place_reviews`
--
ALTER TABLE `place_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT pour la table `place_review_images`
--
ALTER TABLE `place_review_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `reply_likes`
--
ALTER TABLE `reply_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `review_reactions`
--
ALTER TABLE `review_reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT pour la table `review_replies`
--
ALTER TABLE `review_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `searches`
--
ALTER TABLE `searches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `support_messages`
--
ALTER TABLE `support_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT pour la table `trip_attendance`
--
ALTER TABLE `trip_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_bookings_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `comment_replies`
--
ALTER TABLE `comment_replies`
  ADD CONSTRAINT `comment_replies_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `deals_bookings`
--
ALTER TABLE `deals_bookings`
  ADD CONSTRAINT `fk_deals_bookings_deal` FOREIGN KEY (`deal_id`) REFERENCES `place_deals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_deals_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `place_comments`
--
ALTER TABLE `place_comments`
  ADD CONSTRAINT `place_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `place_comments_ibfk_2` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `place_deals`
--
ALTER TABLE `place_deals`
  ADD CONSTRAINT `fk_place_deals_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_place_deals_place` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `place_highlights`
--
ALTER TABLE `place_highlights`
  ADD CONSTRAINT `place_highlights_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `place_ratings`
--
ALTER TABLE `place_ratings`
  ADD CONSTRAINT `place_ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `place_ratings_ibfk_2` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `place_reviews`
--
ALTER TABLE `place_reviews`
  ADD CONSTRAINT `fk_review_place` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `place_review_images`
--
ALTER TABLE `place_review_images`
  ADD CONSTRAINT `place_review_images_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `place_reviews` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reply_likes`
--
ALTER TABLE `reply_likes`
  ADD CONSTRAINT `reply_likes_ibfk_1` FOREIGN KEY (`reply_id`) REFERENCES `comment_replies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `support_messages`
--
ALTER TABLE `support_messages`
  ADD CONSTRAINT `support_messages_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `trip_attendance`
--
ALTER TABLE `trip_attendance`
  ADD CONSTRAINT `fk_attendance_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_attendance_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_attendance_user` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
