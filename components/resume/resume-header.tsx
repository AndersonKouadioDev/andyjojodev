import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import me_image from "@/public/me.png";
interface ResumeHeaderProps {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedIn: string;
  github: string;
}

export function ResumeHeader({
  name,
  title,
  location,
  email,
  phone,
  linkedIn,
  github,
}: ResumeHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row gap-8 items-center mb-8 pb-6 border-b border-primary/80 dark:border-primary/60 transition-colors duration-300">
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
        <Image
          src={me_image}
          alt={name}
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-wide">
          {name}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground font-medium mb-4">
          {title}
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-5 mb-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-primary/70" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Mail size={14} className="text-primary/70" />
            {email}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={14} className="text-primary/70" />
            {phone}
          </span>
        </div>

        <div className="flex justify-center md:justify-start gap-6 mt-3">
          <a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
