"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { createClient } from "@/lib/supabase/client";

const defaultTeam = [
  {
    name: "Raunak",
    role: "Technology & Digital",
    bio: "Social media strategy and technology operations keeping Kutumb's client experience seamless and modern.",
    image:
      "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301027/raunak_ftpboc.png",
  },
  {
    name: "Tanishq",
    role: "Client Relations",
    bio: "Ensuring every family receives attentive, responsive service from the first conversation through every milestone.",
    image:
      "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780394568/tanishq_i9einp.png",
  },
  {
    name: "Harsh",
    role: "CRM & Operations",
    bio: "Managing client relationships and internal coordination so your experience with Kutumb is always coherent and reliable.",
    image:
      "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780394568/harsh_ftie7y.png",
  },
  {
    name: "Atri Ganguly",
    role: "Compliance & Legal",
    bio: "25+ years of senior management experience across portfolio management, financial planning, and risk management. Our families' interests are legally protected at every step.",
    image:
      "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301670/attri_rcnc0p.png",
  },
  {
    name: "Tejpal Singh Bagga",
    role: "Investments & Portfolio",
    bio: "Certified financial planner with 20+ years advising on mutual funds, SIFs, AIFs, and portfolio structuring for HNI families.",
    image:
      "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301742/tejpal_bzcxev.png",
  },
  {
    name: "Soumik Saha",
    role: "Portfolio Management",
    bio: "CFP(CM) with 20+ years supporting financial advisory professionals and HNI investors across bonds, AIFs, ETFs, and structured products.",
    image:
      "https://res.cloudinary.com/dtzqrfg6q/image/upload/v1780301742/soumik_qfrcte.png",
  },
  {
    name: "Sarbani Sadhu Das",
    role: "Insurance Specialist",
    bio: "Experienced sales and distribution professional focused on mediclaim, general insurance, and investor engagement across cross-functional mandates.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
];

export default function AboutTeam() {
  const supabase = useMemo(() => createClient(), []);
  const [members, setMembers] = useState(defaultTeam);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_founder", false)
        .order("display_order", { ascending: true });

      if (data && data.length > 0) {
        setMembers(
          data.map((d: any) => ({
            name: d.name,
            role: d.role,
            bio: d.bio,
            image: d.image_url,
          }))
        );
      }
    })();
  }, [supabase]);
  return (
    <AnimatedSection className="bg-cream py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#B8862B]">
            The Kutumb Team
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-navy sm:text-5xl lg:text-5xl lg:leading-[1.12]">
            The People{" "}
            <span className="text-[#B8862B]">Behind Kutumb</span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone sm:text-xl">
            A team united by a shared belief: every family deserves a financial
            advisor who sees the complete picture.
          </p>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl bg-white p-8 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold/5 sm:p-10"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8862B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-ivory shadow-inner ring-2 ring-gold/10 ring-offset-2 ring-offset-white transition-all duration-500 group-hover:ring-gold/30 group-hover:shadow-lg">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="112px"
                    priority={member.name === "Soumik Saha"}
                    className="object-cover"
                  />
                ) : (
                  <span className="font-serif text-3xl font-semibold text-navy/30">
                    {member.name[0]}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-2xl text-navy">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-[#B8862B]">{member.role}</p>

              <div className="mx-auto mt-5 h-px w-12 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

              <p className="mt-5 text-sm leading-relaxed text-stone/80">
                {member.bio}
              </p>

              <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#B8862B]/5 px-3.5 py-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B8862B" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-[11px] font-medium text-[#B8862B]/70">{member.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
