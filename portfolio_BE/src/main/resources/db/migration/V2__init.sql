CREATE TABLE IF NOT EXISTS portfolio_projects (
  id            BIGSERIAL PRIMARY KEY,
  project_name  VARCHAR(255) NOT NULL,
  description   TEXT,
  thumbnail     VARCHAR(255),
  screenshot    VARCHAR(255),
  repo_url      VARCHAR(255),
  repo_live     VARCHAR(255),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);