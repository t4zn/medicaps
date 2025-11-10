-- Create profiles table (Enhanced)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  program TEXT,
  year TEXT,
  branch TEXT,
  college TEXT DEFAULT 'Medicaps University',
  city TEXT,
  state TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'moderator')),
  
  -- Academic Information
  enrollment_number TEXT UNIQUE,
  admission_year INTEGER,
  graduation_year INTEGER,
  cgpa DECIMAL(3,2),
  semester INTEGER,
  
  -- Contact & Social
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  
  -- Preferences & Settings
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  language_preference TEXT DEFAULT 'en',
  
  -- Activity & Engagement
  points INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  total_uploads INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Verification & Status
  is_verified BOOLEAN DEFAULT false,
  verification_type TEXT CHECK (verification_type IN ('email', 'phone', 'student_id', 'manual')),
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned', 'pending')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create files table
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT, -- Legacy field, now optional
  github_url TEXT, -- Legacy field
  cdn_url TEXT, -- Legacy field
  google_drive_url TEXT NOT NULL, -- New field for Google Drive links
  file_size BIGINT,
  mime_type TEXT DEFAULT 'application/pdf',
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

-- User Connections & Social Features
CREATE TABLE user_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- User Activity Logs
CREATE TABLE user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'logout', 'upload', 'download', 'profile_update', 'password_change')),
  description TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File Reviews & Ratings
CREATE TABLE file_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_helpful BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_id, user_id)
);

-- File Votes (Thumbs Up/Down)
CREATE TABLE file_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_id, user_id)
);

-- File Bookmarks/Favorites
CREATE TABLE file_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  folder_name TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_id, user_id)
);

-- Study Groups
CREATE TABLE study_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  program TEXT,
  year TEXT,
  subject TEXT,
  created_by UUID REFERENCES profiles(id),
  max_members INTEGER DEFAULT 50,
  is_private BOOLEAN DEFAULT false,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Group Members
CREATE TABLE study_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Notifications System
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error', 'upload_approved', 'new_follower', 'group_invite')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements & Badges
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  badge_color TEXT DEFAULT '#3B82F6',
  criteria JSONB, -- Stores achievement criteria
  points_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- File Reports & Moderation
CREATE TABLE file_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES profiles(id),
  reason TEXT CHECK (reason IN ('inappropriate', 'copyright', 'spam', 'wrong_category', 'low_quality', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions (for better security tracking)
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  location_info JSONB,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File Tags System
CREATE TABLE file_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6B7280',
  created_by UUID REFERENCES profiles(id),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE file_tag_relations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES file_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_id, tag_id)
);

-- User Preferences & Settings
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  download_notifications BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  file_approval_notifications BOOLEAN DEFAULT true,
  group_invites BOOLEAN DEFAULT true,
  auto_download_quality TEXT DEFAULT 'original' CHECK (auto_download_quality IN ('original', 'compressed')),
  default_file_visibility TEXT DEFAULT 'public' CHECK (default_file_visibility IN ('public', 'private', 'friends')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics & Statistics
CREATE TABLE daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_uploads INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_file_size BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Approved files are viewable by everyone" ON files FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can insert files" ON files FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can view their own files" ON files FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can insert downloads" ON downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own downloads" ON downloads FOR SELECT USING (auth.uid() = user_id);

-- User Connections Policies
CREATE POLICY "Users can view their connections" ON user_connections FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can create connections" ON user_connections FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update their connections" ON user_connections FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- User Activities Policies
CREATE POLICY "Users can view their own activities" ON user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activities" ON user_activities FOR INSERT WITH CHECK (true);

-- File Reviews Policies
CREATE POLICY "Reviews are publicly viewable" ON file_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON file_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reviews" ON file_reviews FOR UPDATE USING (auth.uid() = user_id);

-- File Votes Policies
CREATE POLICY "Votes are publicly viewable" ON file_votes FOR SELECT USING (true);
CREATE POLICY "Users can create votes" ON file_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their votes" ON file_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their votes" ON file_votes FOR DELETE USING (auth.uid() = user_id);

-- File Bookmarks Policies
CREATE POLICY "Users can view their bookmarks" ON file_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON file_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their bookmarks" ON file_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Study Groups Policies
CREATE POLICY "Public groups are viewable" ON study_groups FOR SELECT USING (is_private = false OR created_by = auth.uid());
CREATE POLICY "Users can create groups" ON study_groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group creators can update" ON study_groups FOR UPDATE USING (auth.uid() = created_by);

-- Study Group Members Policies
CREATE POLICY "Group members can view membership" ON study_group_members FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM study_group_members sgm WHERE sgm.group_id = study_group_members.group_id AND sgm.user_id = auth.uid()));
CREATE POLICY "Users can join groups" ON study_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- User Achievements Policies
CREATE POLICY "Achievements are publicly viewable" ON achievements FOR SELECT USING (true);
CREATE POLICY "User achievements are publicly viewable" ON user_achievements FOR SELECT USING (true);

-- File Reports Policies
CREATE POLICY "Users can create reports" ON file_reports FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can view their reports" ON file_reports FOR SELECT USING (auth.uid() = reported_by);

-- User Sessions Policies
CREATE POLICY "Users can view their sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their sessions" ON user_sessions FOR UPDATE USING (auth.uid() = user_id);

-- File Tags Policies
CREATE POLICY "Tags are publicly viewable" ON file_tags FOR SELECT USING (true);
CREATE POLICY "Tag relations are publicly viewable" ON file_tag_relations FOR SELECT USING (true);

-- User Preferences Policies
CREATE POLICY "Users can view their preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated' 
  AND (storage.filename(name))::text LIKE (auth.uid()::text || '-%')
);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated' 
  AND (storage.filename(name))::text LIKE (auth.uid()::text || '-%')
);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated' 
  AND (storage.filename(name))::text LIKE (auth.uid()::text || '-%')
);

-- Storage policies for files
CREATE POLICY "Files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'files');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE USING (bucket_id = 'files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

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

-- Enhanced Functions
CREATE OR REPLACE FUNCTION handle_new_user_enhanced()
RETURNS TRIGGER AS $$$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update upload count
    IF TG_TABLE_NAME = 'files' THEN
      UPDATE profiles 
      SET total_uploads = total_uploads + 1,
          points = points + 10
      WHERE id = NEW.uploaded_by;
    END IF;
    
    -- Update download count
    IF TG_TABLE_NAME = 'downloads' THEN
      UPDATE profiles 
      SET total_downloads = total_downloads + 1,
          points = points + 1
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET last_active = NOW()
  WHERE id = auth.uid();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate file ratings
CREATE OR REPLACE FUNCTION calculate_file_rating(file_uuid UUID)
RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    SELECT COALESCE(AVG(rating), 0)
    FROM file_reviews
    WHERE file_id = file_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get user reputation
CREATE OR REPLACE FUNCTION calculate_user_reputation(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  rep_score INTEGER := 0;
BEGIN
  -- Base points from profile
  SELECT COALESCE(points, 0) INTO rep_score FROM profiles WHERE id = user_uuid;
  
  -- Add points from helpful reviews
  rep_score := rep_score + (
    SELECT COALESCE(COUNT(*) * 5, 0)
    FROM file_reviews
    WHERE user_id = user_uuid AND is_helpful = true
  );
  
  -- Add points from file ratings
  rep_score := rep_score + (
    SELECT COALESCE(SUM(
      CASE 
        WHEN avg_rating >= 4.5 THEN 20
        WHEN avg_rating >= 4.0 THEN 15
        WHEN avg_rating >= 3.5 THEN 10
        WHEN avg_rating >= 3.0 THEN 5
        ELSE 0
      END
    ), 0)
    FROM (
      SELECT AVG(fr.rating) as avg_rating
      FROM files f
      JOIN file_reviews fr ON f.id = fr.file_id
      WHERE f.uploaded_by = user_uuid
      GROUP BY f.id
    ) file_ratings
  );
  
  RETURN rep_score;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  achievement_record RECORD;
  user_uploads INTEGER;
  user_downloads INTEGER;
  user_points INTEGER;
BEGIN
  -- Get user stats
  SELECT total_uploads, total_downloads, points 
  INTO user_uploads, user_downloads, user_points
  FROM profiles WHERE id = user_uuid;
  
  -- Check for upload achievements
  FOR achievement_record IN 
    SELECT * FROM achievements 
    WHERE is_active = true 
    AND criteria->>'type' = 'uploads'
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements 
      WHERE user_id = user_uuid AND achievement_id = achievements.id
    )
  LOOP
    IF user_uploads >= (achievement_record.criteria->>'threshold')::INTEGER THEN
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (user_uuid, achievement_record.id);
      
      -- Award points
      UPDATE profiles 
      SET points = points + achievement_record.points_reward
      WHERE id = user_uuid;
    END IF;
  END LOOP;
  
  -- Check for download achievements
  FOR achievement_record IN 
    SELECT * FROM achievements 
    WHERE is_active = true 
    AND criteria->>'type' = 'downloads'
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements 
      WHERE user_id = user_uuid AND achievement_id = achievements.id
    )
  LOOP
    IF user_downloads >= (achievement_record.criteria->>'threshold')::INTEGER THEN
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (user_uuid, achievement_record.id);
      
      -- Award points
      UPDATE profiles 
      SET points = points + achievement_record.points_reward
      WHERE id = user_uuid;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Additional Triggers
CREATE TRIGGER update_user_upload_stats
  AFTER INSERT ON files
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_user_download_stats
  AFTER INSERT ON downloads
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_profile_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_last_active();

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria, points_reward) VALUES
('First Upload', 'Upload your first file', '🎉', '{"type": "uploads", "threshold": 1}', 50),
('Contributor', 'Upload 5 files', '📚', '{"type": "uploads", "threshold": 5}', 100),
('Knowledge Sharer', 'Upload 10 files', '🌟', '{"type": "uploads", "threshold": 10}', 200),
('Expert Contributor', 'Upload 25 files', '🏆', '{"type": "uploads", "threshold": 25}', 500),
('Download Enthusiast', 'Download 10 files', '📥', '{"type": "downloads", "threshold": 10}', 25),
('Active Learner', 'Download 50 files', '🎓', '{"type": "downloads", "threshold": 50}', 100),
('Knowledge Seeker', 'Download 100 files', '🔍', '{"type": "downloads", "threshold": 100}', 200);

-- Create indexes for better performance
CREATE INDEX idx_profiles_program_year ON profiles(program, year);
CREATE INDEX idx_profiles_last_active ON profiles(last_active);
CREATE INDEX idx_files_program_year_category ON files(program, year, category);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_file_id ON downloads(file_id);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, is_read);
CREATE INDEX idx_file_reviews_file_id ON file_reviews(file_id);
CREATE INDEX idx_file_votes_file_id ON file_votes(file_id);
CREATE INDEX idx_file_votes_user_id ON file_votes(user_id);
CREATE INDEX idx_file_bookmarks_user_id ON file_bookmarks(user_id);