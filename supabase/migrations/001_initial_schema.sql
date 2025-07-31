-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'designer' CHECK (role IN ('admin', 'designer', 'reviewer', 'manager')),
  status TEXT NOT NULL DEFAULT 'active',
  workplace TEXT,
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  birthdate DATE,
  contact_info TEXT,
  address TEXT,
  job_title TEXT,
  education TEXT,
  experience INTEGER,
  skills TEXT,
  services TEXT[] DEFAULT '{}',
  service1 TEXT,
  service2 TEXT,
  service3 TEXT,
  service4 TEXT,
  service5 TEXT,
  service6 TEXT,
  designer_notes TEXT,
  reviewer_notes TEXT,
  payment_status TEXT DEFAULT 'pending',
  down_payment DECIMAL(10,2),
  remaining_amount DECIMAL(10,2),
  transfer_number TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  designer_rating INTEGER CHECK (designer_rating >= 1 AND designer_rating <= 5),
  reviewer_rating INTEGER CHECK (reviewer_rating >= 1 AND reviewer_rating <= 5),
  designer_feedback TEXT,
  reviewer_feedback TEXT,
  assigned_designer UUID REFERENCES users(id),
  assigned_reviewer UUID REFERENCES users(id),
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  notes TEXT,
  login_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tasks policies
CREATE POLICY "Users can view tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Assigned users can update tasks" ON tasks
  FOR UPDATE USING (
    assigned_designer = auth.uid() OR 
    assigned_reviewer = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete tasks" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Accounts policies (admin only)
CREATE POLICY "Only admins can access accounts" ON accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- Storage policies
CREATE POLICY "Users can upload attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attachments' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attachments' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their attachments" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'attachments' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'attachments' AND
    auth.role() = 'authenticated'
  );
