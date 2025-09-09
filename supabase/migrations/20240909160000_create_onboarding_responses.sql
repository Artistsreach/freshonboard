-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id BIGSERIAL PRIMARY KEY,
  business_name TEXT NOT NULL,
  industry TEXT,
  social_platforms JSONB DEFAULT '[]'::jsonb,
  data_sources JSONB DEFAULT '[]'::jsonb,
  selected_features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own records
CREATE POLICY "Enable insert for authenticated users" ON public.onboarding_responses
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create policy to allow users to read their own records
CREATE POLICY "Enable read access for users based on auth.uid()" ON public.onboarding_responses
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create policy to allow users to update their own records
CREATE POLICY "Enable update for users based on id" ON public.onboarding_responses
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the table
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.onboarding_responses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
