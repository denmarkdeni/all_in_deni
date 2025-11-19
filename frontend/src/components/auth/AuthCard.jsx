export default function AuthCard({ children }) {
    return (
      <div
        className="glass-card w-full max-w-md p-8 rounded-3xl shadow-2xl
                   animate-scaleIn hover:shadow-3xl transition-all duration-500
                   hover:scale-[0.98]"
      >
        {children}
      </div>
    );
  }
  