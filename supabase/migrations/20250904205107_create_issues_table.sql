-- Create issues table for storing streetlight issue reports
CREATE TABLE IF NOT EXISTS public.issues (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'rejected')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  reportedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT NOT NULL,
  reportedBy TEXT NOT NULL,
  assignedTo TEXT,
  hasPhoto BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Create policies for issues table
CREATE POLICY "Authenticated users can view issues" 
ON public.issues 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Only admins can create, update, and delete issues
CREATE POLICY "Admins can insert issues" 
ON public.issues 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin') AND is_active = true
  )
);

CREATE POLICY "Admins can update issues" 
ON public.issues 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin') AND is_active = true
  )
);

CREATE POLICY "Admins can delete issues" 
ON public.issues 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin') AND is_active = true
  )
);

-- Trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_issues_updated_at ON public.issues;
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();