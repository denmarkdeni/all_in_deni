export default function PrimaryButton({ children }) {
    return (
      <button
        className="w-full py-3 rounded-xl font-semibold text-white
                   bg-gradient-to-br from-[#7C3AED] via-[#3B82F6] to-[#06B6D4]
                   hover:scale-[1.03] active:scale-[0.98]
                   transition-all duration-300 shadow-lg
                   hover:shadow-sm hover:shadow-indigo-500/50
                   active:shadow-md
                   transform-gpu"
        type="submit"
      >
        {children}
      </button>
    );
  }
  