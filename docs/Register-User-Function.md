# IoT BLE Attendance Register - Check-In Management

This function checks whether the device is enabled before registering the student.

```SQL
CREATE OR REPLACE FUNCTION register_student(device_id_param UUID, student_id TEXT)
RETURNS VOID AS $$
DECLARE
    device_enabled BOOLEAN;
BEGIN
    -- Check if the device is enabled
    SELECT function_enabled INTO device_enabled
    FROM device_function
    WHERE device_id = device_id_param;

    IF device_enabled THEN
        -- Run your logic to register the student here
        INSERT INTO register (student_id)
        VALUES (student_id);
    ELSE
        RAISE EXCEPTION 'Device is not enabled';
    END IF;
END;
$$ LANGUAGE plpgsql;


```
