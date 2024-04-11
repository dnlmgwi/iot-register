# IoT BLE Attendance Register - Device Management

A cron job that runs periodically to check the last execution time of each device's functionality. If the last execution time is older than 10 minutes, it should toggle the device's function state.

This cron job will run every 5 minutes. Adjust the interval as needed.

```SQL
SELECT cron.schedule('call-check-device-last-execution-function', '*/5 * * * *', 'CALL check_device_last_execution()');

```

```SQL
CREATE OR REPLACE FUNCTION check_device_last_execution()
RETURNS VOID AS $$
DECLARE
    device_row RECORD;
BEGIN
    FOR device_row IN SELECT * FROM device_function_schedule LOOP
        IF device_row.last_execution < CURRENT_TIMESTAMP - INTERVAL '10 minutes' THEN
            -- If last execution is older than 10 minutes, toggle the function state
            PERFORM toggle_device_function_state(device_row.device_id);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## Changing Default Timezone

```SQL
ALTER TABLE device_function_schedule
ALTER COLUMN last_execution SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE '+2');
```

## Trigger to Check Last Device Execution

```SQL
CREATE OR REPLACE FUNCTION trigger_schedule_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Trigger the schedule after an insert operation on the register table
    PERFORM check_device_last_execution();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

```SQL
CREATE TRIGGER schedule_trigger
AFTER INSERT ON register
FOR EACH ROW
EXECUTE FUNCTION trigger_schedule_on_insert();
```

## Functions

### View CRON Jobs

```SQL
SELECT * FROM cron.job;
```

### Remove CRON Job

```SQL
SELECT cron.unschedule('job-name');
```
