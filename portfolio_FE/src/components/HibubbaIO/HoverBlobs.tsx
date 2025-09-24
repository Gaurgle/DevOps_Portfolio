// HoverBlobs.tsx (React)
export function HoverBlobs({ children }: { children: React.ReactNode }) {
    return (
        <span className="relative inline-block group">
      <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 scale-95 transition duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
        {/* You can paste your AnimatedBlobs' three colored spans here,
            but sized to the link area */}
          <span className="absolute -inset-3 rounded-full blur-xl bg-purple-600/40 mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <span className="absolute -inset-3 rounded-full blur-xl bg-yellow-500/40 mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: "2s" }} />
        <span className="absolute -inset-3 rounded-full blur-xl bg-pink-600/40 mix-blend-multiply dark:mix-blend-screen animate-blob" style={{ animationDelay: "1s" }} />
      </span>
      <span className="relative z-10 px-4 py-2 rounded-xl">{children}</span>
    </span>
    );
}