const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* Document outline */}
      <rect
        x="20"
        y="10"
        width="60"
        height="80"
        rx="4"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        fill="none"
      />

      {/* Document lines */}
      <line x1="30" y1="25" x2="70" y2="25" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="35" x2="70" y2="35" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="45" x2="55" y2="45" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />

      {/* User icon */}
      <circle cx="50" cy="60" r="8" fill="url(#logoGradient)" />
      <path
        d="M 35 80 Q 35 70 50 70 Q 65 70 65 80"
        fill="url(#logoGradient)"
      />
    </svg>
  );
};

export default Logo;
