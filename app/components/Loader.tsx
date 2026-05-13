"use client";

type LoaderProps = {
  progress: number;
};

export default function Loader({ progress }: LoaderProps) {
  return (
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black
        flex flex-col items-center justify-center
        overflow-hidden
      "
    >
      <h1 className="text-white text-[90px] font-extrabold tracking-tight">
        THE SPEED
      </h1>

      <div className="w-[300px] h-[3px] bg-white/20 mt-10 overflow-hidden">
        <div
          className="h-full bg-red transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-white/60 mt-5 text-[18px]">
        {progress}%
      </p>
    </div>
  );
}