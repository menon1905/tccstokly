/*
  # Seed data for test user (teste@gmail.com)
  
  1. Data Added
    - Products: Morango, Maçã, Manga, Amora, Banana, Chocolate, Palitos
    - Customers: 10 customers for the fruit shop
    - Sales: Historical sales from May-October 2025 with emphasis on strawberry fever in July/August
    - Purchases: Stock replenishment orders matching sales patterns
  
  2. Important Notes
    - All data is linked to user_id: d8b062ea-e837-4c83-9c9b-946c820f961d
    - Morango (strawberry) shows dramatic sales increase in July/August (Febre do Morango do Amor)
    - RLS policies remain active - data properly isolated per user
*/

DO $$ 
DECLARE
  user_uuid uuid := 'd8b062ea-e837-4c83-9c9b-946c820f961d';
  morango_id uuid := '8d50e0c3-e777-459d-944d-b787748360f2';
  maca_id uuid := '4e972005-8f23-47b2-b35e-580ab368dbf2';
  manga_id uuid := 'c0ac49b8-4f04-4d38-959c-f6fcdd5bedfa';
  amora_id uuid := 'de5820af-5095-4021-b2d1-206c75acb1d6';
  banana_id uuid := 'd5443861-cf15-40a7-a8e3-06c0e71c3d9e';
  chocolate_id uuid := 'ecfe8334-1b24-4f87-a7be-01467762b50a';
  palitos_id uuid := '1c39414c-b0e9-494c-8c59-7df0d7ac1486';
  customer_ids uuid[] := ARRAY[
    '4eed363b-0e56-4e9c-b028-c7e366d3010e'::uuid,
    '11d0396e-6bdd-458f-91f2-7bc3ac4ffb07'::uuid,
    '6d0cfd5c-d6bf-4c40-8042-7fd5d0ddf72a'::uuid,
    'b9bb8bb4-d635-4f8b-a364-4e5dbb744cf3'::uuid,
    'ced70c39-2017-4187-bd25-8a477d4d68cf'::uuid,
    '4ffaa54b-7fa9-4957-982e-9bfa9f2ae52f'::uuid,
    '8979946f-58bc-4faf-9210-6dacf654e1f8'::uuid,
    '6955578b-56fe-4bb5-9ac5-eb7a55376293'::uuid,
    '3bc503aa-a4e2-479d-bc18-d69679388c10'::uuid,
    '68bb06bf-72aa-4eba-808d-4f88bac66ce7'::uuid
  ];
BEGIN
  -- MAIO 2025 - Vendas baixas (antes da febre)
  INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at) VALUES
  (morango_id, customer_ids[1], 2, 12.90, 25.80, 'completed', user_uuid, '2025-05-05 10:30:00'),
  (morango_id, customer_ids[2], 1, 12.90, 12.90, 'completed', user_uuid, '2025-05-12 14:20:00'),
  (morango_id, customer_ids[3], 2, 12.90, 25.80, 'completed', user_uuid, '2025-05-19 11:45:00'),
  (morango_id, customer_ids[4], 1, 12.90, 12.90, 'completed', user_uuid, '2025-05-26 16:10:00'),
  (maca_id, customer_ids[5], 2, 8.90, 17.80, 'completed', user_uuid, '2025-05-08 10:00:00'),
  (manga_id, customer_ids[6], 3, 9.50, 28.50, 'completed', user_uuid, '2025-05-13 11:30:00'),
  (amora_id, customer_ids[7], 1, 15.90, 15.90, 'completed', user_uuid, '2025-05-18 15:20:00'),
  (banana_id, customer_ids[8], 4, 6.50, 26.00, 'completed', user_uuid, '2025-05-23 12:40:00');

  -- JUNHO 2025 - Ainda normal
  INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at) VALUES
  (morango_id, customer_ids[9], 2, 12.90, 25.80, 'completed', user_uuid, '2025-06-03 10:15:00'),
  (morango_id, customer_ids[10], 3, 12.90, 38.70, 'completed', user_uuid, '2025-06-09 14:30:00'),
  (morango_id, customer_ids[1], 1, 12.90, 12.90, 'completed', user_uuid, '2025-06-15 11:20:00'),
  (morango_id, customer_ids[2], 2, 12.90, 25.80, 'completed', user_uuid, '2025-06-21 16:45:00'),
  (morango_id, customer_ids[3], 2, 12.90, 25.80, 'completed', user_uuid, '2025-06-27 13:10:00'),
  (maca_id, customer_ids[4], 3, 8.90, 26.70, 'completed', user_uuid, '2025-06-06 11:00:00'),
  (manga_id, customer_ids[5], 2, 9.50, 19.00, 'completed', user_uuid, '2025-06-14 15:30:00'),
  (amora_id, customer_ids[6], 1, 15.90, 15.90, 'completed', user_uuid, '2025-06-22 12:20:00');
  
  -- JULHO 2025 - INÍCIO DA FEBRE! (Vendas diárias)
  FOR dia IN 1..31 LOOP
    INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
    VALUES (
      morango_id,
      customer_ids[1 + (dia % 10)],
      CASE WHEN dia <= 14 THEN 3 + (random() * 5)::int ELSE 5 + (random() * 8)::int END,
      12.90,
      CASE WHEN dia <= 14 THEN (3 + (random() * 5)::int) * 12.90 ELSE (5 + (random() * 8)::int) * 12.90 END,
      'completed',
      user_uuid,
      ('2025-07-' || lpad(dia::text, 2, '0') || ' ' || lpad((9 + random() * 8)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
    );
  END LOOP;

  -- Chocolate e palitos em julho (acompanhando morango)
  FOR i IN 0..8 LOOP
    INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
    VALUES (
      CASE WHEN i % 2 = 0 THEN chocolate_id ELSE palitos_id END,
      customer_ids[1 + (i % 10)],
      1 + (random() * 2)::int,
      CASE WHEN i % 2 = 0 THEN 25.00 ELSE 8.50 END,
      CASE WHEN i % 2 = 0 THEN (1 + (random() * 2)::int) * 25.00 ELSE (1 + (random() * 2)::int) * 8.50 END,
      'completed',
      user_uuid,
      ('2025-07-' || lpad((5 + i * 3)::text, 2, '0') || ' ' || lpad((11 + random() * 6)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
    );
  END LOOP;

  -- AGOSTO 2025 - PICO MÁXIMO! (Vendas diárias massivas)
  FOR dia IN 1..31 LOOP
    INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
    VALUES (
      morango_id,
      customer_ids[1 + (dia % 10)],
      8 + (random() * 12)::int,
      12.90,
      (8 + (random() * 12)::int) * 12.90,
      'completed',
      user_uuid,
      ('2025-08-' || lpad(dia::text, 2, '0') || ' ' || lpad((9 + random() * 8)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
    );
  END LOOP;

  -- Chocolate e palitos massivos em agosto
  FOR i IN 0..9 LOOP
    INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
    VALUES (
      chocolate_id,
      customer_ids[1 + (i % 10)],
      2 + (random() * 4)::int,
      25.00,
      (2 + (random() * 4)::int) * 25.00,
      'completed',
      user_uuid,
      ('2025-08-' || lpad((3 + i * 3)::text, 2, '0') || ' ' || lpad((11 + random() * 6)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
    );
  END LOOP;

  FOR i IN 0..8 LOOP
    INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
    VALUES (
      palitos_id,
      customer_ids[1 + (i % 10)],
      1 + (random() * 3)::int,
      8.50,
      (1 + (random() * 3)::int) * 8.50,
      'completed',
      user_uuid,
      ('2025-08-' || lpad((5 + i * 3)::text, 2, '0') || ' ' || lpad((11 + random() * 6)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
    );
  END LOOP;

  -- SETEMBRO 2025 - Diminuindo
  FOR i IN 0..3 LOOP
    INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
    VALUES (
      morango_id,
      customer_ids[1 + (i % 10)],
      2 + (random() * 3)::int,
      12.90,
      (2 + (random() * 3)::int) * 12.90,
      'completed',
      user_uuid,
      ('2025-09-' || lpad((3 + i * 7)::text, 2, '0') || ' ' || lpad((10 + random() * 6)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
    );
  END LOOP;

  -- OUTUBRO 2025 - Volta ao normal
  FOR i IN 0..4 LOOP
    INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
    VALUES (
      morango_id,
      customer_ids[1 + (i % 10)],
      1 + (random() * 2)::int,
      12.90,
      (1 + (random() * 2)::int) * 12.90,
      'completed',
      user_uuid,
      ('2025-10-' || lpad((2 + i * 5)::text, 2, '0') || ' ' || lpad((10 + random() * 6)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
    );
  END LOOP;

  -- Outras frutas ao longo dos meses (continuidade normal)
  FOR mes IN 7..10 LOOP
    FOR i IN 0..4 LOOP
      INSERT INTO sales (product_id, customer_id, quantity, unit_price, total, status, user_id, created_at)
      VALUES (
        CASE (i % 4)
          WHEN 0 THEN maca_id
          WHEN 1 THEN manga_id
          WHEN 2 THEN amora_id
          ELSE banana_id
        END,
        customer_ids[1 + (i % 10)],
        1 + (random() * 2)::int,
        9.00,
        (1 + (random() * 2)::int) * 9.00,
        'completed',
        user_uuid,
        ('2025-' || lpad(mes::text, 2, '0') || '-' || lpad((5 + i * 5)::text, 2, '0') || ' ' || lpad((10 + random() * 6)::int::text, 2, '0') || ':' || lpad((random() * 59)::int::text, 2, '0') || ':00')::timestamp
      );
    END LOOP;
  END LOOP;

  -- COMPRAS (Purchases)
  INSERT INTO purchases (product_id, supplier, quantity, unit_cost, total, status, user_id, created_at) VALUES
  -- Junho
  (morango_id, 'Sítio Verde', 50, 6.50, 325.00, 'received', user_uuid, '2025-06-10 08:30:00'),
  (maca_id, 'Sítio Verde', 60, 4.20, 252.00, 'received', user_uuid, '2025-06-12 09:00:00'),
  (manga_id, 'Sítio Verde', 50, 4.80, 240.00, 'received', user_uuid, '2025-06-15 10:00:00'),
  -- Julho - Aumentando compras
  (morango_id, 'Sítio Verde', 100, 6.50, 650.00, 'received', user_uuid, '2025-07-05 09:00:00'),
  (chocolate_id, 'Chocolates Premium', 20, 12.00, 240.00, 'received', user_uuid, '2025-07-08 10:15:00'),
  (morango_id, 'Sítio Verde', 200, 6.50, 1300.00, 'received', user_uuid, '2025-07-15 07:30:00'),
  (palitos_id, 'Embalagens Express', 100, 3.20, 320.00, 'received', user_uuid, '2025-07-16 11:00:00'),
  (morango_id, 'Sítio Verde', 250, 6.50, 1625.00, 'received', user_uuid, '2025-07-25 08:00:00'),
  (chocolate_id, 'Chocolates Premium', 30, 12.00, 360.00, 'received', user_uuid, '2025-07-26 09:30:00'),
  -- Agosto - PICO de compras
  (morango_id, 'Sítio Verde', 300, 6.50, 1950.00, 'received', user_uuid, '2025-08-03 07:00:00'),
  (morango_id, 'Sítio Verde', 350, 6.50, 2275.00, 'received', user_uuid, '2025-08-10 07:30:00'),
  (chocolate_id, 'Chocolates Premium', 50, 12.00, 600.00, 'received', user_uuid, '2025-08-12 10:00:00'),
  (morango_id, 'Sítio Verde', 300, 6.50, 1950.00, 'received', user_uuid, '2025-08-18 08:00:00'),
  (palitos_id, 'Embalagens Express', 150, 3.20, 480.00, 'received', user_uuid, '2025-08-20 11:30:00'),
  -- Setembro-Outubro - Reduzindo
  (morango_id, 'Sítio Verde', 100, 6.50, 650.00, 'received', user_uuid, '2025-09-08 09:00:00'),
  (morango_id, 'Sítio Verde', 60, 6.50, 390.00, 'received', user_uuid, '2025-10-05 09:30:00'),
  (maca_id, 'Sítio Verde', 70, 4.20, 294.00, 'received', user_uuid, '2025-10-07 10:00:00');

END $$;
