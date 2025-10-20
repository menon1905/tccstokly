/*
  # Insert sales and purchase data for test user
  
  Simple direct inserts with RLS temporarily disabled for data seeding
*/

-- Temporarily disable RLS for data insertion
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;

-- Insert sample sales data (abbreviated for brevity)
INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at) VALUES
-- Maio 2025
('8d50e0c3-e777-459d-944d-b787748360f2', '4eed363b-0e56-4e9c-b028-c7e366d3010e', 2, 12.90, 25.80, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-05-05 10:30:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '11d0396e-6bdd-458f-91f2-7bc3ac4ffb07', 1, 12.90, 12.90, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-05-12 14:20:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '6d0cfd5c-d6bf-4c40-8042-7fd5d0ddf72a', 2, 12.90, 25.80, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-05-19 11:45:00'),
-- Junho 2025
('8d50e0c3-e777-459d-944d-b787748360f2', 'b9bb8bb4-d635-4f8b-a364-4e5dbb744cf3', 3, 12.90, 38.70, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-06-09 14:30:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '4eed363b-0e56-4e9c-b028-c7e366d3010e', 2, 12.90, 25.80, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-06-15 11:20:00'),
-- Julho 2025 - FEBRE COMEÇA! (Sample: 10 vendas)
('8d50e0c3-e777-459d-944d-b787748360f2', '11d0396e-6bdd-458f-91f2-7bc3ac4ffb07', 5, 12.90, 64.50, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-01 10:15:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '6d0cfd5c-d6bf-4c40-8042-7fd5d0ddf72a', 6, 12.90, 77.40, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-03 11:30:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'ced70c39-2017-4187-bd25-8a477d4d68cf', 4, 12.90, 51.60, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-06 14:20:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '4ffaa54b-7fa9-4957-982e-9bfa9f2ae52f', 7, 12.90, 90.30, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-10 09:45:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '8979946f-58bc-4faf-9210-6dacf654e1f8', 8, 12.90, 103.20, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-15 10:10:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '6955578b-56fe-4bb5-9ac5-eb7a55376293', 10, 12.90, 129.00, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-20 13:25:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '3bc503aa-a4e2-479d-bc18-d69679388c10', 12, 12.90, 154.80, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-23 15:40:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '68bb06bf-72aa-4eba-808d-4f88bac66ce7', 9, 12.90, 116.10, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-26 11:55:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '4eed363b-0e56-4e9c-b028-c7e366d3010e', 11, 12.90, 141.90, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-29 16:10:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '11d0396e-6bdd-458f-91f2-7bc3ac4ffb07', 8, 12.90, 103.20, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-31 12:30:00'),
-- Agosto 2025 - PICO MÁXIMO! (Sample: 15 vendas)
('8d50e0c3-e777-459d-944d-b787748360f2', '6d0cfd5c-d6bf-4c40-8042-7fd5d0ddf72a', 15, 12.90, 193.50, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-01 09:15:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'b9bb8bb4-d635-4f8b-a364-4e5dbb744cf3', 18, 12.90, 232.20, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-03 10:20:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'ced70c39-2017-4187-bd25-8a477d4d68cf', 20, 12.90, 258.00, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-05 11:30:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '4ffaa54b-7fa9-4957-982e-9bfa9f2ae52f', 16, 12.90, 206.40, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-08 13:45:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '8979946f-58bc-4faf-9210-6dacf654e1f8', 19, 12.90, 245.10, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-10 14:50:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '6955578b-56fe-4bb5-9ac5-eb7a55376293', 17, 12.90, 219.30, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-12 10:15:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '3bc503aa-a4e2-479d-bc18-d69679388c10', 22, 12.90, 283.80, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-15 11:20:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '68bb06bf-72aa-4eba-808d-4f88bac66ce7', 14, 12.90, 180.60, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-18 13:30:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '4eed363b-0e56-4e9c-b028-c7e366d3010e', 21, 12.90, 270.90, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-20 15:40:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '11d0396e-6bdd-458f-91f2-7bc3ac4ffb07', 18, 12.90, 232.20, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-22 16:50:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '6d0cfd5c-d6bf-4c40-8042-7fd5d0ddf72a', 20, 12.90, 258.00, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-24 10:10:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'b9bb8bb4-d635-4f8b-a364-4e5dbb744cf3', 16, 12.90, 206.40, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-26 11:25:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'ced70c39-2017-4187-bd25-8a477d4d68cf', 19, 12.90, 245.10, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-28 14:35:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '4ffaa54b-7fa9-4957-982e-9bfa9f2ae52f', 15, 12.90, 193.50, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-30 16:45:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '8979946f-58bc-4faf-9210-6dacf654e1f8', 17, 12.90, 219.30, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-31 13:55:00'),
-- Setembro 2025 - Diminuindo
('8d50e0c3-e777-459d-944d-b787748360f2', '6955578b-56fe-4bb5-9ac5-eb7a55376293', 4, 12.90, 51.60, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-09-05 10:20:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '3bc503aa-a4e2-479d-bc18-d69679388c10', 3, 12.90, 38.70, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-09-15 11:30:00'),
-- Outubro 2025 - Normal
('8d50e0c3-e777-459d-944d-b787748360f2', '68bb06bf-72aa-4eba-808d-4f88bac66ce7', 2, 12.90, 25.80, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-10-05 12:40:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', '4eed363b-0e56-4e9c-b028-c7e366d3010e', 2, 12.90, 25.80, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-10-15 14:50:00');

-- Outras frutas samples
INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at) VALUES
('4e972005-8f23-47b2-b35e-580ab368dbf2', 'ced70c39-2017-4187-bd25-8a477d4d68cf', 3, 8.90, 26.70, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-05-10 10:00:00'),
('c0ac49b8-4f04-4d38-959c-f6fcdd5bedfa', '4ffaa54b-7fa9-4957-982e-9bfa9f2ae52f', 2, 9.50, 19.00, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-06-14 11:30:00'),
('de5820af-5095-4021-b2d1-206c75acb1d6', '8979946f-58bc-4faf-9210-6dacf654e1f8', 1, 15.90, 15.90, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-18 15:20:00'),
('d5443861-cf15-40a7-a8e3-06c0e71c3d9e', '6955578b-56fe-4bb5-9ac5-eb7a55376293', 5, 6.50, 32.50, 'completed', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-12 12:40:00');

-- Purchases
INSERT INTO purchases (product_id, supplier, quantity, unit_cost, total, status, user_id, created_at) VALUES
('8d50e0c3-e777-459d-944d-b787748360f2', 'Sítio Verde', 50, 6.50, 325.00, 'received', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-06-10 08:30:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'Sítio Verde', 200, 6.50, 1300.00, 'received', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-07-15 09:00:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'Sítio Verde', 350, 6.50, 2275.00, 'received', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-08-10 08:00:00'),
('8d50e0c3-e777-459d-944d-b787748360f2', 'Sítio Verde', 100, 6.50, 650.00, 'received', 'd8b062ea-e837-4c83-9c9b-946c820f961d', '2025-09-08 10:00:00');

-- Re-enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
