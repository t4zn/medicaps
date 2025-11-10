-- Subject Requests System
-- Add this to your existing Supabase schema

-- Create subject_requests table
CREATE TABLE subject_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) <= 150),
  program TEXT NOT NULL DEFAULT 'btech',
  branch TEXT NOT NULL, -- cse, ece, mechanical, etc.
  year TEXT NOT NULL, -- 1st-year, 2nd-year, etc.
  requested_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subject_requests ENABLE ROW LEVEL SECURITY;

-- Policies for subject_requests
CREATE POLICY "Users can view their own requests" ON subject_requests FOR SELECT USING (auth.uid() = requested_by);
CREATE POLICY "Users can create subject requests" ON subject_requests FOR INSERT WITH CHECK (auth.uid() = requested_by);
CREATE POLICY "Admins can view all requests" ON subject_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update requests" ON subject_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to notify admins of new subject requests
CREATE OR REPLACE FUNCTION notify_admins_new_subject_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for all admins
  INSERT INTO notifications (user_id, title, message, type, action_url, metadata)
  SELECT 
    p.id,
    'New Subject Request',
    'A new subject "' || NEW.subject_name || '" has been requested for ' || NEW.program || ' ' || NEW.branch || ' ' || NEW.year,
    'info',
    '/admin/subject-requests',
    jsonb_build_object('request_id', NEW.id, 'subject_name', NEW.subject_name)
  FROM profiles p
  WHERE p.role = 'admin';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new subject requests
CREATE TRIGGER on_subject_request_created
  AFTER INSERT ON subject_requests
  FOR EACH ROW EXECUTE FUNCTION notify_admins_new_subject_request();

-- Function to notify user when request is reviewed
CREATE OR REPLACE FUNCTION notify_user_request_reviewed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO notifications (user_id, title, message, type, metadata)
    VALUES (
      NEW.requested_by,
      'Subject Request ' || CASE WHEN NEW.status = 'approved' THEN 'Approved' ELSE 'Rejected' END,
      'Your request for "' || NEW.subject_name || '" has been ' || NEW.status || 
      CASE WHEN NEW.status = 'rejected' AND NEW.rejection_reason IS NOT NULL 
           THEN '. Reason: ' || NEW.rejection_reason 
           ELSE '' END,
      CASE WHEN NEW.status = 'approved' THEN 'success' ELSE 'warning' END,
      jsonb_build_object('request_id', NEW.id, 'subject_name', NEW.subject_name, 'status', NEW.status)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for request status updates
CREATE TRIGGER on_subject_request_reviewed
  AFTER UPDATE ON subject_requests
  FOR EACH ROW EXECUTE FUNCTION notify_user_request_reviewed();

-- Create index for better performance
CREATE INDEX idx_subject_requests_status ON subject_requests(status);
CREATE INDEX idx_subject_requests_requested_by ON subject_requests(requested_by);
CREATE INDEX idx_subject_requests_program_branch_year ON subject_requests(program, branch, year);