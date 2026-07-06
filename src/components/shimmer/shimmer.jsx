export default function Skeleton({ className }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className={`relative overflow-hidden ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.95) 50%, rgba(209,213,219,0.6) 70%, transparent 100%)",
            animation: "shimmer 2s infinite",
          }}
        />
      </div>
    </>
  );
}