import React, { useState, useEffect } from "react";

const DynamicLoadingText = ({ className = "" }) => {
  const loadingMessages = [
    "Analyzing League Settings...",
    "Viewing User Roster...",
    "Looking At Opponent's Roster...",
    "Coming Up With Advice...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % loadingMessages.length
        );
        setIsVisible(true);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`transition-opacity duration-300 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ minWidth: "200px", display: "inline-block" }}
    >
      {loadingMessages[currentMessageIndex]}
    </span>
  );
};

export const DynamicLoadingTextInstant = ({ className = "" }) => {
  const loadingMessages = [
    "Analyzing league settings",
    "Viewing user roster",
    "Looking at opponent's roster",
    "Coming up with advice",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % loadingMessages.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={className}
      style={{ minWidth: "200px", display: "inline-block" }}
    >
      {loadingMessages[currentMessageIndex]}
    </span>
  );
};

export default DynamicLoadingText;
