DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS products;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE products (
  id uuid primary key DEFAULT uuid_generate_v4(),
  title text not null,
  description text,
  price integer,
  image text
);
CREATE TABLE stocks (
  id uuid primary key DEFAULT uuid_generate_v4(),
  product_id uuid,
  count integer,
  foreign key ("product_id") references "products" ("id") on delete cascade
);
INSERT INTO products(id, title, description, price, image)
values (
    '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    'Револьвер Stalker S 4 мм 3" Brown',
    'Револьверы под патрон Флобера (калибр — 4 мм) согласно действующему законодательству не являются огнестрельным оружием и могут продаваться свободно. При этом, внешний вид револьверов настолько реалистичен, что с первого взгяда его элементарно принять за боевой!',
    2400,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4b-b10c-48c5-9345-fc73c48a80aa.jpeg'
  ),
  (
    '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
    'Револьвер Meydan Stalker S 4 мм 4.5\" Black',
    'Револьверы под патрон Флобера, согласно действующему законодательству не являются огнестрельным оружием и могут продаваться свободно. При этом, внешний вид револьверов настолько реалистичен, что с первого взгляда его можно принять за боевой.',
    2470,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4b-b10c-48c5-9345-fc73c48a80a0.jpeg'
  ),
  (
    '7567ec4b-b10c-48c5-9345-fc73c48a80ab',
    'Револьвер Флобера Stalker S 3\" (пластик черный)',
    'Револьверы под патрон Флобера (калибр - 4 мм) согласно действующему законодательству не являются огнестрельным оружием и могут продаваться свободно. При этом, внешний вид револьверов настолько реалистичен, что с первого взгяда его элементарно принять за боевой!',
    2199,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4b-b10c-48c5-9345-fc73c48a80ab.jpeg'
  ),
  (
    '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    'Револьвер Ekol Viper 3 " Chrome',
    'Это револьвер под патрон Флобера производства фирмы Ekol (Турция).Он является копией револьвера Smith & Wesson Model 19.Ekol Viper 3 " может похвастаться качественной сборкой.',
    2795,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4b-b10c-48c5-9345-fc73c48a80a1.jpeg'
  ),
  (
    '7567ec4d-b10c-48c5-9345-fc73c48a80a2',
    'Револьвер Ekol Viper 4.5 MATTE BLACK',
    'Это револьвер под патрон Флобера производства фирмы Ekol (Турция).Он является копией револьвера Smith & Wesson Model 19.',
    2790,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4d-b10c-48c5-9345-fc73c48a80a2.jpeg'
  ),
  (
    '7567ec4b-f10c-48c5-9345-fc73348a80a1',
    'Револьвер Cuno Melcher ME 38 Magnum 4R',
    'Револьвер под патрон Флобера.Емкость барабана — 9 патронов.Рукоять из пластика.Калибр 4 мм.',
    4970,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4b-f10c-48c5-9345-fc73348a80a1.jpeg'
  ),
  (
    '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
    'Револьвер Stalker 4 мм 3 " Brown',
    'Револьверы под патрон Флобера (калибр — 4 мм) согласно действующему законодательству не являются огнестрельным оружием и могут продаваться свободно. При этом, внешний вид револьверов настолько реалистичен, что с первого взгяда его элементарно принять за боевой!',
    2900,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4b-b10c-48c5-9445-fc73c48a80a2.jpeg'
  ),
  (
    '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
    'Револьвер Stalker Titanium 4.5 " Black',
    'Револьвер Stalker Titanium с коротким (11.4 см) стволом, предназначен для развлекательно-спортивной стрельбы и приобретения навыков обращения с оружием. Револьверы под патрон Флобера (калибр — 4 мм) согласно действующему законодательству не являются огнестрельным оружием и могут продаваться свободно. При этом, внешний вид револьверов настолько реалистичен, что с первого взгяда его элементарно принять за боевой!',
    3100,
    'https://d1h7ehaoc1pe6y.cloudfront.net/7567ec4b-b10c-45c5-9345-fc73c48a80a1.jpeg'
  );
INSERT INTO stocks(product_id, count)
values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4),
  ('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 6),
  ('7567ec4b-b10c-48c5-9345-fc73c48a80ab', 7),
  ('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 12),
  ('7567ec4d-b10c-48c5-9345-fc73c48a80a2', 7),
  ('7567ec4b-f10c-48c5-9345-fc73348a80a1', 8),
  ('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 2),
  ('7567ec4b-b10c-45c5-9345-fc73c48a80a1', 3);