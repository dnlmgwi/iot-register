# IoT BLE Attendance Register - Check-In Management

This function checks whether the device is enabled before registering the student.

```SQL

CREATE OR REPLACE FUNCTION register_student(device_id UUID, student_id UUID)
RETURNS VOID AS $$
DECLARE
    device_enabled BOOLEAN;
BEGIN
    SELECT function_enabled INTO device_enabled
    FROM device_function
    WHERE device_id = register_student.device_id;

    IF device_enabled THEN
        INSERT INTO register_table (student_id, device_id)
        VALUES (student_id, device_id);
    ELSE
        RAISE EXCEPTION 'Device is not enabled';
    END IF;
END;
$$ LANGUAGE plpgsql;
```
