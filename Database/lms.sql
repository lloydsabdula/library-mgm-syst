-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2025 at 01:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `isbn` varchar(25) DEFAULT NULL,
  `pages` int(11) DEFAULT NULL CHECK (`pages` > 0),
  `available_copies` int(11) NOT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `publication_year` smallint(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `author`, `isbn`, `pages`, `available_copies`, `publisher`, `publication_year`, `description`, `genre`, `is_deleted`) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 180, 3, 'Charles Scribner\'s Sons', 1925, 'The Great Gatsby is a 1925 tragedy novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with Jay Gatsby, a mysterious millionaire obsessed with reuniting with his former lover, Daisy Buchanan.', 'Classic', 0),
(2, '1984', 'George Orwell', '978-0451524935', 320, 3, 'Secker & Warburg', 1949, 'Nineteen Eighty-Four is a dystopian novel by the English writer George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell\'s ninth and final completed book. Thematically, it centres on totalitarianism, mass surveillance and repressive regimentation of people and behaviours.', 'Dystopian', 0),
(3, 'To Kill a Mockingbird', 'Harper Lee', '978-0446310789', 281, 3, 'J.B. Lippincott & Co.', 1960, 'Set in 1930s Maycomb, Alabama, the story follows young Scout Finch as her lawyer father, Atticus, defends Tom Robinson, a Black man falsely accused of raping a white woman, exposing deep-seated racial prejudice despite Atticus\'s strong defense', 'Classic', 0),
(4, 'Pride and Prejudice', 'Jane Austen', NULL, 259, 3, 'T. Egerton, Whitehall', 1813, 'Pride and Prejudice, which was published by Jane Austen in 1813, follows the burgeoning relationship between Elizabeth Bennet, the daughter of a country gentleman, and the wealthy, reserved Fitzwilliam Darcy. They must overcome their central flaws of pride and prejudice in order to fall in love and marry.', 'Romance', 0),
(5, 'The Catcher in the Rye', 'J.D. Salinger', '978-0316769488', 234, 7, 'Little, Brown and Company', 1951, 'The Catcher in the Rye is about 16-year-old Holden Caulfield, a disillusioned prep school student who, after being expelled, wanders through New York City for a few days, railing against the \"phoniness\" of the adult world while struggling with grief, loneliness, and a desire to protect childhood innocence', 'Classic', 0),
(6, 'Harry Potter and the Philosopher\'s Stone', 'J. K. Rowling', '978-0747532699', 223, 10, 'Bloomsbury Publishing', 1997, 'Harry Potter and the Philosopher\'s Stone follows orphaned Harry Potter discovering he\'s a wizard, attending Hogwarts, making friends Ron and Hermione, and learning about the evil Lord Voldemort who murdered his parents.', 'Fantasy', 0),
(7, 'The Hobbit', 'J. R. R. Tolkien', NULL, 310, 7, 'George Allen & Unwin', 1937, 'The Hobbit follows home-loving hobbit Bilbo Baggins, who is recruited by Gandalf the wizard and thirteen dwarves, led by Thorin Oakenshield, to reclaim their stolen treasure from the fearsome dragon Smaug at the Lonely Mountain', 'Fantasy', 0),
(8, 'A Brave New World', 'Aldous Huxley', '978-0701107901', 311, 4, 'Chatto & Windus', 1932, 'Brave New World is a dystopian novel by Aldous Huxley set in a futuristic World State where science, technology, and conditioning create a stable, class-based society by eliminating individuality, strong emotions, and personal relationships for engineered happiness through promiscuity, consumerism, and the drug soma', 'Dystopian', 0);

-- --------------------------------------------------------

--
-- Table structure for table `borrowing_transaction`
--

CREATE TABLE `borrowing_transaction` (
  `transaction_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `borrow_date` date NOT NULL,
  `due_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowing_transaction`
--

INSERT INTO `borrowing_transaction` (`transaction_id`, `student_id`, `book_id`, `borrow_date`, `due_date`, `return_date`, `staff_id`, `status`) VALUES
(1, 1, 1, '2025-12-17', '2025-12-31', '2025-12-17', 1, 'returned'),
(3, 2, 2, '2025-12-17', '2025-12-12', '2025-12-17', 2, 'late'),
(4, 1, 2, '2025-12-18', '2026-01-01', NULL, 1, 'borrowed'),
(6, 1, 1, '2025-12-18', '2025-12-25', '2025-12-18', 1, 'returned'),
(7, 1, 3, '2025-12-18', '2026-01-01', NULL, 1, 'borrowed'),
(8, 1, 7, '2025-12-18', '2026-01-01', NULL, 1, 'borrowed');

--
-- Triggers `borrowing_transaction`
--
DELIMITER $$
CREATE TRIGGER `prevent_borrow_if_no_copies` BEFORE INSERT ON `borrowing_transaction` FOR EACH ROW BEGIN
    DECLARE copies INT;

    SELECT available_copies INTO copies
    FROM books
    WHERE book_id = NEW.book_id;

    IF copies <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot borrow book: no available copies';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `borrow_requests`
--

CREATE TABLE `borrow_requests` (
  `request_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `request_date` date NOT NULL DEFAULT curdate(),
  `status` enum('pending','approved','denied') NOT NULL DEFAULT 'pending',
  `handled_by_staff` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrow_requests`
--

INSERT INTO `borrow_requests` (`request_id`, `student_id`, `book_id`, `request_date`, `status`, `handled_by_staff`) VALUES
(2, 1, 1, '2025-12-18', 'denied', 1),
(3, 1, 3, '2025-12-18', 'approved', 1),
(4, 1, 7, '2025-12-18', 'approved', 1);

-- --------------------------------------------------------

--
-- Table structure for table `penalty`
--

CREATE TABLE `penalty` (
  `penalty_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `amount` decimal(8,2) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `date_issued` date NOT NULL,
  `date_paid` date DEFAULT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penalty`
--

INSERT INTO `penalty` (`penalty_id`, `transaction_id`, `staff_id`, `amount`, `reason`, `date_issued`, `date_paid`, `student_id`) VALUES
(2, 3, 1, 60.00, 'Corrected staff after audit', '2025-12-17', '2025-12-17', 2);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `first_name`, `last_name`, `position`, `user_id`) VALUES
(1, 'Evelyn', 'Foster', 'Librarian', 9),
(2, 'Eleanor', 'Vance', 'Head Librarian', 10),
(3, 'Jasper', 'Finch', 'Assistant Librarian', 11),
(4, 'Willow', 'Hayes', 'IT Staff', 12),
(5, 'Caleb', 'Thorne', 'IT Staff', 13),
(6, 'Seraphina', 'Bell', 'Librarian', 14),
(7, 'Owen', 'Sterling', 'Assistant Librarian', 15),
(8, 'Aurora', 'Skye', 'Librarian', 16);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `lrn` varchar(12) NOT NULL,
  `favorite_genre` varchar(255) DEFAULT NULL,
  `monthly_reading_goal` int(11) DEFAULT NULL CHECK (`monthly_reading_goal` >= 0),
  `course` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `first_name`, `last_name`, `lrn`, `favorite_genre`, `monthly_reading_goal`, `course`, `section`, `user_id`) VALUES
(1, 'John Benedict', 'Iledan', '2024300386', 'Fantasy', 5, 'BSCS', '3A', 1),
(2, 'Justin Lloyd', 'Sabdula', '2023456098', 'Romance', 7, 'BSIT', '3C', 2),
(3, 'Nathan', 'Perez', '2022348912', 'Horror', 5, 'BSIS', '1C', 3),
(4, 'Karl Chrirstian', 'Legaspi', '2023445670', 'Classic', 4, 'BSCE', '4A', 4),
(5, 'Neil Christian', 'Grospe', '2022407897', 'Fantasy', 3, 'BSECE', '3B', 5),
(6, 'Gen Benedict', 'Casio', '2023567890', 'Classic', 2, 'BSBA', '2A', 6),
(7, 'Ynigo', 'Patron', '2023555123', 'Horror', 3, 'BSHM', '1A', 7),
(8, 'Matthew', 'Abenis', '2022556786', 'Dystopian', 4, 'BSTM', '2C', 8);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` enum('students','staff','admin') NOT NULL,
  `status` enum('active','inactive','suspended','banned') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `deletion_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `phone_number`, `role`, `status`, `created_at`, `is_deleted`, `deletion_date`) VALUES
(1, 'johniledan', '$2b$10$gO2Nqim6QyTgADNYMsgAwu08ZtBgx9oNrLM8yF2qIpHtd9Pdv0eim', 'johniledan@pcu.edu.ph', '09174526832', 'students', 'active', '2021-04-21 15:38:29', 0, NULL),
(2, 'justinsabdula', '$2b$10$LPpNMFAsEkVZwp3aUqM/cuiEs6esKFDRY0ejoJ4hHrvqqMVnru0lS', 'justinsabdula@pcu.edu.ph', '09228175940', 'students', 'active', '2024-05-06 15:43:28', 0, NULL),
(3, 'nathanperez', '$2b$10$Me8tk8FKqT0OBkpC2Kq9BuJEeUHD5RQBuaPzx5kcxeelDVaDgyUBq', 'nathanperez@pcu.edu.ph', '09352047816', 'students', 'active', '2023-08-10 15:44:52', 0, NULL),
(4, 'karllegaspi', '$2b$10$nlljwNYy.3KsXO18ipasAeYkopdKh0B0Q1TDPELl40Rk7Iz3RS0bm', 'karllegaspi@pcu.edu.ph', '09493761528', 'students', 'active', '2024-02-04 15:47:31', 0, NULL),
(5, 'neilgrospe', '$2b$10$cxQYHM5.WVHJzuz5.Zc70.uzD3o.mV8cgX.RF9vW54taJF/C0kfqm', 'neilgrospe@pcu.edu.ph', '09615874309', 'students', 'active', '2025-07-13 15:47:31', 0, NULL),
(6, 'gencasio', '$2b$10$jmIVvguO/MkSALSkPwdH1epWiYrzIxfL9x04iZqSIp4bIaVQVmFga', 'gencasio@pcu.edu.ph', '09751208643', 'students', 'active', '2024-11-12 15:57:52', 0, NULL),
(7, 'ynigopatron', '$2b$10$SQFqhOSN9ajzH4lfmC7FrOfYC/p1mkKmj84DBccq0yg5ncWf.qyOO', 'ynigopatron@pcu.edu.ph', '09196432750', 'students', 'active', '2023-01-17 15:57:52', 0, NULL),
(8, 'matthewabenis', '$2b$10$rkHuqsyb5xS7hjgb8w1oXuPI/Jy2bzY2h2vANB5m2UWK5CxJKXY86', 'matthewabenis@pcu.edu.ph', '09287504913', 'students', 'active', '2025-06-10 15:59:54', 0, NULL),
(9, 'evelynfoster', '$2b$10$AlQXkA6yCrjMdiZ/7JPoluP.xvv6M8BWfihXiwo3vZ8J4AMFmnP/O', 'evelynfoster@pcu.edu.ph', '09398612375', 'staff', 'active', '2017-08-14 15:59:54', 0, NULL),
(10, 'eleanorvance', '$2b$10$578EuA21znhTL8dd84GGie71tAzUtgClRpxBt6maIJ9TqWGLiPK7a', 'eleanorvance@pcu.edu.ph', '09453296871', 'admin', 'active', '2018-03-12 16:02:46', 0, NULL),
(11, 'jasperfinch', '$2b$10$ziktLmuLuUidL26s3zekXeB1mZIfpHhEnPCrE05ozWSvVpDZqxk2q', 'jasperfinch@pcu.edu.ph', '09634721589', 'staff', 'active', '2019-04-15 16:02:46', 0, NULL),
(12, 'willowhayes', '$2b$10$R6Qv2vG1SIT4/GTcVqXzLuO3U6GQ2c4ZaVk5W0yYvhPiXN7QIx4Lq', 'willowhayes@pcu.edu.ph', '09775864032', 'admin', 'active', '2016-10-25 16:06:25', 0, NULL),
(13, 'calebthorne', '$2b$10$lrRiIW8yP8r21vcdfCZCBOA0Yn4R6Aya0H3aIgCxX1rXVWU1xpAzC', 'calebthorne@pcu.edu.ph', '09182604973', 'admin', 'active', '2019-05-30 16:06:25', 0, NULL),
(14, 'seraphinabell', '$2b$10$CLI73I3bu3ujVhUhH0GQCOMbVKo9VTQgHreskcy9Lc5dDvsYd2x4G', 'seraphinabell@pcu.edu.ph', '09273946851', 'staff', 'active', '2015-08-31 16:08:16', 0, NULL),
(15, 'owensterling', '$2b$10$beKusnuZAC0UzpXPJs.ISO43I7RzJrirubGt55zzwWzz1DIU1MTAO', 'owensterling@pcu.edu.ph', '09338752410', 'staff', 'active', '2018-08-08 16:08:16', 0, NULL),
(16, 'auroraskye', '$2b$10$uInaYb1S.SNESa7aFpysTeAAG22nHSvNRqNlSY/QdnyRxZt55Rll6', 'auroraskye@pdu.edu.ph', '09476123589', 'staff', 'active', '2016-07-22 16:10:16', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`),
  ADD UNIQUE KEY `isbn` (`isbn`);

--
-- Indexes for table `borrowing_transaction`
--
ALTER TABLE `borrowing_transaction`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `borrow_requests`
--
ALTER TABLE `borrow_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `student_id_idx` (`student_id`),
  ADD KEY `book_id_idx` (`book_id`),
  ADD KEY `staff_id_idx` (`handled_by_staff`);

--
-- Indexes for table `penalty`
--
ALTER TABLE `penalty`
  ADD PRIMARY KEY (`penalty_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD KEY `fk_staff_user` (`user_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `lrn` (`lrn`),
  ADD KEY `fk_student_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `borrowing_transaction`
--
ALTER TABLE `borrowing_transaction`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `borrow_requests`
--
ALTER TABLE `borrow_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `penalty`
--
ALTER TABLE `penalty`
  MODIFY `penalty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrowing_transaction`
--
ALTER TABLE `borrowing_transaction`
  ADD CONSTRAINT `borrowing_transaction_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `borrowing_transaction_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_ID`),
  ADD CONSTRAINT `staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`);

--
-- Constraints for table `borrow_requests`
--
ALTER TABLE `borrow_requests`
  ADD CONSTRAINT `fk_borrow_request_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  ADD CONSTRAINT `fk_borrow_request_staff` FOREIGN KEY (`handled_by_staff`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `fk_borrow_request_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`);

--
-- Constraints for table `penalty`
--
ALTER TABLE `penalty`
  ADD CONSTRAINT `penalty_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `borrowing_transaction` (`transaction_id`),
  ADD CONSTRAINT `student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
