-- Update the handle_new_user function to set initial dream credits to 3
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
begin
  insert into public.profiles (id, email, name, dream_credits)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 3);
  return new;
end;
$$ language plpgsql security definer;
