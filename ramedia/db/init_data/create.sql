DROP TABLE IF EXISTS user_info CASCADE;
CREATE TABLE IF NOT EXISTS user_info (
  id VARCHAR(30) NOT NULL,
  liked VARCHAR(10)[],
  PRIMARY KEY(id)
)