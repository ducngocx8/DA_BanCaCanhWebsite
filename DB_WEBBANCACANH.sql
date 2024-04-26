DROP TABLE IF EXISTS CARTS;
DROP TABLE IF EXISTS FISH_PRICE;
DROP TABLE IF EXISTS COUPONS;
DROP TABLE IF EXISTS IMAGE; 
DROP TABLE IF EXISTS OTPS;
DROP TABLE IF EXISTS RATES;
DROP TABLE IF EXISTS ORDER_DETAILS; 
DROP TABLE IF EXISTS SIZE; 
DROP TABLE IF EXISTS FISH; 
DROP TABLE IF EXISTS USER_ROLES;
DROP TABLE IF EXISTS ORDERS;
DROP TABLE IF EXISTS USERS; 
DROP TABLE IF EXISTS ROLES; 
DROP TABLE IF EXISTS CATEGORIES;

-- Bảng 1: Category
CREATE TABLE IF NOT EXISTS CATEGORIES (
    category_id SERIAL NOT NULL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- Bảng 2: Fish
CREATE TABLE IF NOT EXISTS FISH(
	fish_id SERIAL NOT NULL PRIMARY KEY,
    fish_name VARCHAR(255) NOT NULL, 
    fish_description VARCHAR(255),
    fish_status BOOLEAN DEFAULT TRUE, 
    category_id BIGINT,
    ph VARCHAR(255),
    temperature VARCHAR(255),
    food VARCHAR(255),
    behavior VARCHAR(255),
    origin VARCHAR(255),
    CONSTRAINT fk_category_from_fish FOREIGN KEY (category_id) REFERENCES CATEGORIES(category_id)
);

-- Bảng 3: Size
CREATE TABLE IF NOT EXISTS SIZE(
	size_id SERIAL NOT NULL PRIMARY KEY,
    size_name VARCHAR(255) NOT NULL
);

-- Bảng 4: FISH_PRICE
CREATE TABLE IF NOT EXISTS FISH_PRICE(
	fish_id BIGINT,
	size_id BIGINT,
    fish_remain INT DEFAULT 0 NOT NULL, 
    PRIMARY KEY (fish_id, size_id),
	CONSTRAINT fk_fish_from_fishPrice FOREIGN KEY (fish_id) REFERENCES FISH(fish_id),
    CONSTRAINT fk_size_from_fishPrice FOREIGN KEY (size_id) REFERENCES SIZE(size_id),
    price BIGINT NOT NULL
);

-- Bảng 5: ROLES (role_id, role_code role_name)
CREATE TABLE IF NOT EXISTS ROLES(
	role_id SERIAL NOT NULL PRIMARY KEY,
    role_code VARCHAR(30) NOT NULL,
    role_name VARCHAR(30) NOT NULL
);

-- Bảng 6: USERS
CREATE TABLE IF NOT EXISTS USERS(
	user_id SERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
	address VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    phonenumber VARCHAR(10),
    user_status INT NOT NULL DEFAULT 1
);

-- Bảng 7: USER_DETAILS
CREATE TABLE IF NOT EXISTS CARTS(
	user_id BIGINT,
    fish_id BIGINT,
    size_id BIGINT,
	amount INT NOT NULL,
	PRIMARY KEY (user_id, fish_id, size_id),
    CONSTRAINT fk_user_from_carts FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    CONSTRAINT fk_fish_from_carts FOREIGN KEY (fish_id) REFERENCES FISH(fish_id),
    CONSTRAINT fk_size_from_carts FOREIGN KEY (size_id) REFERENCES SIZE(size_id)
);

-- Bảng 8: USER_ROLES
CREATE TABLE IF NOT EXISTS USER_ROLES(
	user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
	CONSTRAINT fk_user_from_userRoles FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    CONSTRAINT fk_role_from_userRoles FOREIGN KEY (role_id) REFERENCES ROLES(role_id)
);

-- Bảng 9: RATES
CREATE TABLE IF NOT EXISTS RATES(
	user_id BIGINT,
    fish_id BIGINT,
	rate_point INT NOT NULL,
    rate_comment VARCHAR(500) DEFAULT '',
    rate_time TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, fish_id),
	CONSTRAINT fk_user_from_rates FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    CONSTRAINT fk_fish_from_rates FOREIGN KEY (fish_id) REFERENCES FISH(fish_id)
);

-- Bảng 10: OTPS
CREATE TABLE IF NOT EXISTS OTPS(
	id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
	otp_code VARCHAR(255) NOT NULL,
    time_send TIMESTAMP,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    otp_type INT NOT NULL
);

-- Status: 1: Đặt Hàng, 2: Xác Nhận, 3: Vận Chuyển, 5: Thành Công, 4: Yêu Cầu Hủy Đơn, 6: Đã Hủy, 7: Y/C Hủy toàn bộ, 8: Đã hủy toàn bộ
-- Bảng 11: ORDERS
CREATE TABLE IF NOT EXISTS ORDERS(
	order_id SERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT,
    order_status INT,
    order_time TIMESTAMP NOT NULL,
	phonenumber VARCHAR(10) NOT NULL,
    address VARCHAR(256) NOT NULL,
    save_money BIGINT NOT NULL DEFAULT 0,
	note VARCHAR(255) NOT NULL DEFAULT '',
    CONSTRAINT fk_user_from_orders FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- Bảng 12: ORDER_DETAILS
CREATE TABLE IF NOT EXISTS ORDER_DETAILS(
	order_id BIGINT,
    fish_id BIGINT,
    size_id BIGINT,
    amount INT NOT NULL,
    price BIGINT NOT NULL,
	exchange INT NOT NULL DEFAULT 0,
    PRIMARY KEY (order_id, fish_id, size_id),
    CONSTRAINT fk_fish_from_orderDetails FOREIGN KEY (fish_id) REFERENCES FISH(fish_id),
    CONSTRAINT fk_order_from_orderDetails FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
    CONSTRAINT fk_size_from_orderDetails FOREIGN KEY (size_id) REFERENCES SIZE(size_id)
);

-- Bảng 13: IMAGE
CREATE TABLE IF NOT EXISTS IMAGE(
	image_id SERIAL NOT NULL PRIMARY KEY,
    fish_id BIGINT,
    url_image VARCHAR(256) NOT NULL,
	CONSTRAINT fk_fish_from_image FOREIGN KEY (fish_id) REFERENCES FISH(fish_id)
);


-- Bảng 14: COUPON 
CREATE TABLE IF NOT EXISTS COUPONS(
	coupon_id SERIAL NOT NULL PRIMARY KEY,
    coupon_name VARCHAR(256) NOT NULL,
    discount INT NOT NULL,
    min_order BIGINT NOT NULL,
    save_money_max BIGINT NOT NULL,
	coupon_expired DATE NOT NULL
);
