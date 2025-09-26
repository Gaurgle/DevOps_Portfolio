CREATE TABLE contact_messages (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  message       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  handled       BOOLEAN NOT NULL DEFAULT FALSE
)