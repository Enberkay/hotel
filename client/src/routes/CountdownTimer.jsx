import React, { useState, useEffect } from "react";

const CountdownTimer = ({ duration, onReset }) => {
    const [time, setTime] = useState(duration);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev > 0) return prev - 1;
                if (onReset) onReset(); // เรียก callback เมื่อหมดเวลา
                return duration; // รีเซ็ตเวลานับใหม่
            });
        }, 1000);

        return () => clearInterval(timer); // เคลียร์ interval เมื่อ component ถูก unmount
    }, [duration, onReset]);

    return (
        <p className="text-sm text-gray-500">
            รีเฟรชข้อมูลในอีก {time} วินาที
        </p>
    );
};

export default CountdownTimer;
