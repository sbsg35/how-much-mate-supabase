CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS suburb (
  suburb_id varchar PRIMARY KEY,
  locality varchar NOT NULL,
  postcode varchar NOT NULL,
  state varchar NOT NULL,
  position geometry(Point, 4326) NOT NULL,
  display_name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suburb_locality ON suburb (locality);
CREATE INDEX IF NOT EXISTS idx_suburb_postcode ON suburb (postcode);
CREATE INDEX IF NOT EXISTS idx_suburb_state ON suburb (state);
CREATE INDEX IF NOT EXISTS idx_suburb_position ON suburb USING GIST (position);