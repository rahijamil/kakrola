import Image from "next/image";
import React from "react";

const KakrolaLogo = ({
  size = "sm",
  isTitle,
}: {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  isTitle?: boolean;
}) => {
  const sizeClasses = {
    xs: "w-5 h-5",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
    "2xl": "w-24 h-24",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          {/* <!-- White Background --> */}
          <rect width="200" height="200" rx="16" ry="16" fill="#ffffff" />

          {/* <!-- Hashtag Symbol with Gradient and Shadow --> */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#005c83", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#004d6e", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#0076a3", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#005a8e", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#69afcd", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#4a8fb1", stopOpacity: 1 }}
              />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="4"
                dy="4"
                stdDeviation="4"
                floodColor="#000000"
                floodOpacity="0.2"
              />
            </filter>
          </defs>

          {/* <!-- Hashtag Symbol --> */}
          <g filter="url(#shadow)">
            {/* <!-- Vertical Bars --> */}
            <rect
              x="40"
              y="40"
              width="20"
              height="120"
              rx="10"
              fill="url(#grad1)"
            />
            <rect
              x="80"
              y="40"
              width="20"
              height="120"
              rx="10"
              fill="url(#grad2)"
            />
            {/* <!-- Horizontal Bars --> */}
            <rect
              x="30"
              y="70"
              width="140"
              height="20"
              rx="10"
              fill="url(#grad3)"
            />
            <rect
              x="30"
              y="110"
              width="140"
              height="20"
              rx="10"
              fill="url(#grad1)"
            />
          </g>
        </svg>
      </div>

      {isTitle && (
        <span
          className={`font-semibold text-primary-600 ${
            size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl"
          }`}
        >
          Kakrola
        </span>
      )}
    </div>
  );
};

export default KakrolaLogo;
