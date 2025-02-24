-- Create the database
CREATE DATABASE UserDatabase;

-- Connect to the newly created database
\c UserDatabase;

-- Create the Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    AuthLevel INT NOT NULL
);