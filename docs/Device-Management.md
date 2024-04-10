# IoT BLE Attendance Register - Device Management

These SQL Queries allow us to manage the functionality of each device individually, devices are disabled after specific intervals for to prevent the register function execution, each device can be toggled on/off.

## Database Structure and Functions

### Table for Device Functionality

``` SQL
CREATE TABLE device_function (
    device_id UUID PRIMARY KEY,
    function_enabled BOOLEAN DEFAULT FALSE
);
```

### Table for Device Function Schedules

```SQL
CREATE TABLE device_function_schedule (
    device_id UUID REFERENCES device_function(device_id),
    schedule_interval INTERVAL,
    last_execution TIMESTAMPTZ,
    CONSTRAINT device_function_schedule_pkey PRIMARY KEY (device_id)
);
```

### Functions to Enable and Disable Device Functionality

```SQL
CREATE OR REPLACE FUNCTION enable_device_function(device_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE device_function SET function_enabled = TRUE WHERE device_id = enable_device_function.device_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION disable_device_function(device_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE device_function SET function_enabled = FALSE WHERE device_id = disable_device_function.device_id;
END;
$$ LANGUAGE plpgsql;
```

### Function to Toggle Functionality State

```SQL
CREATE OR REPLACE FUNCTION toggle_device_function_state(device_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE device_function
    SET function_enabled = NOT function_enabled
    WHERE device_id = toggle_device_function_state.device_id;

    IF function_enabled THEN
        INSERT INTO device_function_schedule (device_id, schedule_interval, last_execution)
        VALUES (device_id, INTERVAL '10 minutes', CURRENT_TIMESTAMP)
        ON CONFLICT (device_id) DO NOTHING; -- If already scheduled, do nothing
    ELSE
        DELETE FROM device_function_schedule WHERE device_id = toggle_device_function_state.device_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

### Scheduled Job to Execute Device Functionality

```SQL
SELECT cron.schedule('call-device-function', '*/1 * * * *', 'CALL execute_device_function()');
```

### Function to Execute Device Functionality

``` SQL
CREATE OR REPLACE FUNCTION execute_device_function()
RETURNS VOID AS $$
DECLARE
    device_row RECORD;
BEGIN
    FOR device_row IN SELECT * FROM device_function WHERE function_enabled = TRUE LOOP
        -- Your logic to execute device functionality goes here
        -- Example: Assuming a function called "device_functionality" is executed
        PERFORM device_functionality(device_row.device_id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```
