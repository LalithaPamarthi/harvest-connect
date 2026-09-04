CREATE TYPE public.app_role AS ENUM ('farmer', 'buyer', 'transporter');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'buyer',
  full_name text NOT NULL DEFAULT '',
  phone text,
  village text,
  company_name text,
  business_email text,
  gst_id text,
  billing_address text,
  vehicle_type text,
  capacity_tons numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
BEGIN
  _role := COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'role', ''), 'buyer')::public.app_role;

  INSERT INTO public.profiles (
    id, role, full_name, phone, village, company_name, business_email,
    gst_id, billing_address, vehicle_type, capacity_tons
  ) VALUES (
    NEW.id,
    _role,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'village',
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.raw_user_meta_data ->> 'business_email',
    NEW.raw_user_meta_data ->> 'gst_id',
    NEW.raw_user_meta_data ->> 'billing_address',
    NEW.raw_user_meta_data ->> 'vehicle_type',
    NULLIF(NEW.raw_user_meta_data ->> 'capacity_tons', '')::numeric
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_name text NOT NULL DEFAULT '',
  required_date date NOT NULL,
  destination jsonb NOT NULL,
  items jsonb NOT NULL,
  matches jsonb NOT NULL,
  logistics jsonb,
  farmer_responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  transport_status text NOT NULL DEFAULT 'Pending',
  transporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_buyer_id_idx ON public.orders (buyer_id);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users read orders" ON public.orders
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Buyers create own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id AND public.has_role(auth.uid(), 'buyer'));
CREATE POLICY "Buyers update own orders" ON public.orders
  FOR UPDATE TO authenticated USING (auth.uid() = buyer_id) WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Farmers respond to orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'farmer')) WITH CHECK (public.has_role(auth.uid(), 'farmer'));
CREATE POLICY "Transporters update delivery status" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'transporter')) WITH CHECK (public.has_role(auth.uid(), 'transporter'));