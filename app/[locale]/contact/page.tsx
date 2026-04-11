"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MessageCircle, Phone, MapPin, Linkedin, Github, ArrowRight } from "lucide-react";
import { MainNav } from "@/components/navigation/main-nav";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { MagneticButton } from "@/components/ui/magnetic-button";
import dynamic from "next/dynamic";
const ThreeCursorBlob = dynamic(
  () => import("@/components/three/three-cursor-blob").then(m => ({ default: m.ThreeCursorBlob })),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_NUMBER = "2250554020623";

function buildWhatsAppUrl(name: string, email: string, subject: string, message: string): string {
  const text = `Bonjour Anderson,\n\nJe suis ${name} (${email}).\n\nSujet : ${subject}\n\n${message}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(20),
});
type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const resumeT = useTranslations("resume");
  const contactT = useTranslations("contact_page");
  const pageRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (data: FormValues) => {
    toast.success(contactT("success_message"), {
      description: contactT("success_description"),
    });
    const url = buildWhatsAppUrl(data.name, data.email, data.subject, data.message);
    window.open(url, "_blank", "noopener,noreferrer");
    form.reset();
  };

  useGSAP(() => {
    gsap.fromTo(".contact-header", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3,
    });
    gsap.fromTo(".contact-card", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out",
      scrollTrigger: { trigger: ".contact-grid", start: "top 80%", once: true },
    });
  }, []);

  const contactItems = [
    {
      icon: MessageCircle,
      label: contactT("label_whatsapp"),
      value: "+225 05 54 020 623",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
    },
    {
      icon: Phone,
      label: contactT("label_phone"),
      value: resumeT("phone"),
      href: `tel:${resumeT("phone")}`,
    },
    {
      icon: MapPin,
      label: contactT("label_location"),
      value: resumeT("location"),
      href: null,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Anderson Kouadio",
      href: resumeT("linkedIn"),
    },
    {
      icon: Github,
      label: "GitHub",
      value: "AndersonKouadioDev",
      href: resumeT("github"),
    },
  ];

  return (
    <div className="relative min-h-screen bg-background cursor-none-desktop overflow-hidden">
      <CustomCursor />

      {/* Three.js blob background */}
      <ThreeCursorBlob className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      <MainNav />

      <div ref={pageRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
        {/* Header */}
        <div className="contact-header flex flex-col gap-4 mb-16">
          <span className="font-mono-brand text-xs text-primary tracking-widest uppercase">
            — {contactT("eyebrow")}
          </span>
          <h1 className="font-display text-section text-foreground">
            {contactT("title_1")} <span className="text-primary">{contactT("title_2")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            {contactT("subtitle")}
          </p>
        </div>

        <div className="contact-grid grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left — Contact infos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Open to work badge */}
            <div className="contact-card glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <p className="font-display font-semibold text-foreground">{contactT("open_to_work_title")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {contactT("available_now")}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp direct CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card flex items-center gap-4 rounded-2xl p-5 border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all duration-200 shrink-0">
                <MessageCircle size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-400 font-display">{contactT("whatsapp_direct")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{contactT("whatsapp_direct_sub")}</p>
              </div>
              <ArrowRight size={14} className="ml-auto shrink-0 text-green-400/50 group-hover:text-green-400 transition-colors" />
            </a>

            {/* Contact items */}
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              const Wrapper = item.href ? "a" : "div";
              return (
                <MagneticButton key={i} strength={0.15} className="w-full">
                  <Wrapper
                    href={item.href ?? undefined}
                    target={item.href?.startsWith("http") ? "_blank" : undefined}
                    rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cn(
                      "contact-card glass rounded-2xl p-5 border border-border/30",
                      "hover:border-primary/25 transition-all duration-200",
                      "flex items-center gap-4 group w-full",
                      item.href && "cursor-pointer"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-mono-brand mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.value}
                      </p>
                    </div>
                    {item.href && (
                      <ArrowRight
                        size={14}
                        className="ml-auto shrink-0 text-muted-foreground/30 group-hover:text-primary transition-colors"
                      />
                    )}
                  </Wrapper>
                </MagneticButton>
              );
            })}
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <div className="contact-card glass rounded-2xl p-8 border border-border/30">
              <h2 className="font-display text-xl font-semibold text-foreground mb-8">
                {contactT("title_section_2")}
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            {contactT("name_placeholder")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-border/50 focus:border-primary/50 rounded-xl h-12 bg-background/60 text-foreground placeholder:text-muted-foreground/40"
                              placeholder="Anderson Kouadio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            {contactT("email_placeholder")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="border-border/50 focus:border-primary/50 rounded-xl h-12 bg-background/60 text-foreground placeholder:text-muted-foreground/40"
                              placeholder="email@exemple.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          {contactT("subject_placeholder")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-border/50 focus:border-primary/50 rounded-xl h-12 bg-background/60 text-foreground placeholder:text-muted-foreground/40"
                            placeholder={contactT("subject_input_placeholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          {contactT("message_placeholder")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="border-border/50 focus:border-primary/50 rounded-xl bg-background/60 text-foreground placeholder:text-muted-foreground/40 resize-none"
                            placeholder={contactT("message_input_placeholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <MagneticButton className="w-full mt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-display font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                      disabled={form.formState.isSubmitting}
                    >
                      <MessageCircle size={18} />
                      {contactT("send")}
                      <ArrowRight size={16} className="ml-auto" />
                    </Button>
                  </MagneticButton>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
