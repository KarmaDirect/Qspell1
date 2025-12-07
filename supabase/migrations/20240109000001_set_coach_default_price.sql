-- Set default hourly_rate to 30€ for coaches
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coaches') THEN
    -- Update existing coaches without hourly_rate to 30€
    UPDATE coaches 
    SET hourly_rate = 30.00 
    WHERE hourly_rate IS NULL;
    
    -- Set default value for new coaches (if column exists)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coaches' AND column_name = 'hourly_rate') THEN
      ALTER TABLE coaches 
      ALTER COLUMN hourly_rate SET DEFAULT 30.00;
    END IF;
  END IF;
END $$;

