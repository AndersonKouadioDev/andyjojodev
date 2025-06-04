"use client";

import { MainNav } from "@/components/navigation/main-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const resumeT = useTranslations("resume");
  const actionsT = useTranslations("contact_page");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message envoyé", {
      description: "Je vous répondrai dans les plus brefs délais.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <MainNav />
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-4xl font-bold text-primary mb-8">Contact</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{actionsT("title_section_1")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <span>{resumeT("email")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary" size={20} />
                <span>{resumeT("phone")}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={20} />
                <span>{resumeT("location")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{actionsT("title_section_2")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Nom" required />
                <Input type="email" placeholder="Email" required />
                <Textarea
                  placeholder="Message"
                  className="min-h-[120px]"
                  required
                />
                <Button type="submit" className="w-full">
                  {actionsT("send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
