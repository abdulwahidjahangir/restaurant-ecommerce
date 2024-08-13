"use client";

import React, { useState, useEffect } from "react";

function getFutureDate(days: number) {
  let today = new Date();
  today.setDate(today.getDate() + days);
  return today;
}

function formatNumber(num: number) {
  return num.toString().padStart(2, '0');
}

const CountDown = () => {
  const futureDate = getFutureDate(7);
  
  const [delay, setDelay] = useState(() => {
    const today = new Date();
    const difference = futureDate.getTime() - today.getTime();
    return Math.floor(difference / 1000);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDelay(prevDelay => prevDelay - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (delay <= 0) {
      setDelay(0);
    }
  }, [delay]);

  const d = Math.floor(delay / (60 * 60 * 24));
  const h = Math.floor((delay / (60 * 60)) % 24);
  const m = Math.floor((delay / 60) % 60);
  const s = Math.floor(delay % 60);

  return (
    <span className="font-bold text-5xl text-yellow-300">
      {formatNumber(d)}:{formatNumber(h)}:{formatNumber(m)}:{formatNumber(s)}
    </span>
  );
};

export default CountDown;
