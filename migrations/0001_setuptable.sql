-- Migration number: 0001 	 2024-05-28T17:55:50.064Z
CREATE TABLE IF NOT EXISTS lift_data (
    chat_id INTEGER PRIMARY KEY,
    bench_one_rep_max INTEGER,
    deadlift_one_rep_max INTEGER,
    squat_one_rep_max INTEGER,
    shoulder_press_one_rep_max INTEGER
);
