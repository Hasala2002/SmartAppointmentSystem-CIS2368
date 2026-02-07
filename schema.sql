-- ========= Extensions =========
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========= Enums =========
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('staff','customer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('pending','confirmed','checked_in','in_progress','completed','cancelled','no_show');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE queue_status AS ENUM ('waiting','called','serving','completed','left');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('appointment_confirmation','appointment_reminder','appointment_cancelled','queue_position_update','queue_called');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_channel AS ENUM ('email','sms','push','in_app');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_status AS ENUM ('pending','sent','delivered','failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ========= updated_at trigger helper =========
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========= Tables =========

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar UNIQUE NOT NULL,
  password_hash varchar NOT NULL,
  first_name varchar NOT NULL,
  last_name varchar NOT NULL,
  phone varchar,
  role user_role NOT NULL DEFAULT 'customer',
  is_active boolean NOT NULL DEFAULT true,
  email_verified boolean NOT NULL DEFAULT false,
  last_login_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  slug varchar UNIQUE NOT NULL,
  address varchar,
  city varchar,
  state varchar,
  zip_code varchar,
  phone varchar,
  timezone varchar NOT NULL DEFAULT 'America/Chicago',
  appointment_duration_mins int NOT NULL DEFAULT 30,
  buffer_mins int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  settings jsonb,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

-- Staff assignments - links users to locations they can manage
-- Global staff: has_global_access = true and location_id = null
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false,
  has_global_access boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT ck_staff_scope CHECK (
    (has_global_access = true AND location_id IS NULL)
    OR
    (has_global_access = false AND location_id IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week int NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT ck_day_of_week CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT ck_availability_time CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  scheduled_start timestamp NOT NULL,
  scheduled_end timestamp NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  check_in_time timestamp,
  actual_start_time timestamp,
  actual_end_time timestamp,
  cancellation_reason text,
  notes text,
  reminder_sent boolean NOT NULL DEFAULT false,
  confirmation_token varchar UNIQUE,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT ck_scheduled_time CHECK (scheduled_end > scheduled_start)
);

CREATE TABLE IF NOT EXISTS queue_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  queue_number int NOT NULL,
  position int NOT NULL,
  estimated_wait_mins int,
  priority int NOT NULL DEFAULT 0,
  status queue_status NOT NULL DEFAULT 'waiting',
  joined_at timestamp NOT NULL DEFAULT now(),
  called_at timestamp,
  serving_started_at timestamp,
  completed_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT uq_queue_number_per_location UNIQUE (location_id, queue_number)
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  channel notification_channel NOT NULL,
  subject varchar,
  body text NOT NULL,
  status notification_status NOT NULL DEFAULT 'pending',
  sent_at timestamp,
  delivered_at timestamp,
  read_at timestamp,
  error_message text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type varchar NOT NULL,
  entity_id uuid NOT NULL,
  action varchar NOT NULL,
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  changes jsonb,
  ip_address varchar,
  user_agent text,
  created_at timestamp NOT NULL DEFAULT now()
);

-- ========= Indexes =========
CREATE INDEX IF NOT EXISTS idx_staff_location ON staff(location_id);
CREATE INDEX IF NOT EXISTS idx_staff_user ON staff(user_id);

CREATE INDEX IF NOT EXISTS idx_availability_location_day ON availability(location_id, day_of_week);

CREATE INDEX IF NOT EXISTS idx_appointments_location_time ON appointments(location_id, scheduled_start);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_queue_location_status_pos ON queue_entries(location_id, status, position);
CREATE INDEX IF NOT EXISTS idx_queue_customer ON queue_entries(customer_id);
CREATE INDEX IF NOT EXISTS idx_queue_appointment ON queue_entries(appointment_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);

-- ========= updated_at triggers =========
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated_at') THEN
    CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_locations_updated_at') THEN
    CREATE TRIGGER trg_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_appointments_updated_at') THEN
    CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_queue_entries_updated_at') THEN
    CREATE TRIGGER trg_queue_entries_updated_at
    BEFORE UPDATE ON queue_entries
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;
