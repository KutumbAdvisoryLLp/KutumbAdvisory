import Hero from "@/components/Hero";
import EmotionalMoment from "@/components/EmotionalMoment";
import Problem from "@/components/Problem";
import FinancialKundali from "@/components/FinancialKundali";
import FinancialToolkit from "@/components/FinancialToolkit";
import Trust from "@/components/Trust";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
        <EmotionalMoment />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy/6 to-transparent" />
        <Problem />
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <FinancialKundali />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy/6 to-transparent" />
        <FinancialToolkit />
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <Trust />
      </div>
    </>
  );
}
