-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create files table
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  github_url TEXT,
  cdn_url TEXT,
  file_size BIGINT,
  mime_type TEXT,
  program TEXT NOT NULL, -- btech, bsc, bba, etc.
  year TEXT NOT NULL, -- 1st-year, 2nd-year, etc.
  subject TEXT, -- chemistry, physics, etc.
  category TEXT NOT NULL, -- notes, pyqs, formula-sheet
  uploaded_by UUID REFERENCES profiles(id),
  downloads INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create downloads table for tracking
CREATE TABLE downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  ip_address INET,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Approved files are viewable by everyone" ON files FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can insert files" ON files FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can view their own files" ON files FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can insert downloads" ON downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own downloads" ON downloads FOR SELECT USING (auth.uid() = user_id);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();