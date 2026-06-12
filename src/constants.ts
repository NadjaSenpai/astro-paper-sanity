import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
// import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
// import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
// import IconFacebook from "@/assets/icons/IconFacebook.svg";
// import IconTelegram from "@/assets/icons/IconTelegram.svg";
// import IconPinterest from "@/assets/icons/IconPinterest.svg";
import type { SiteConfig } from "@/lib/sanity/api/types";

export function getSocialLinks(site: SiteConfig) {
  return [
    {
      name: "Github",
      href: site.github,
      linkTitle: `${site.author} on Github`,
      icon: IconGitHub,
    },
    {
      name: "X",
      href: site.twitter,
      linkTitle: `${site.author} on X`,
      icon: IconBrandX,
    },
    /*
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/username/",
      linkTitle: `${site.title} on LinkedIn`,
      icon: IconLinkedin,
    },
    */
    {
      name: "Mail",
      href: `mailto:${site.email}`,
      linkTitle: `Send an email to ${site.author}`,
      icon: IconMail,
    },
  ] as const;
}

export function getShareLinks() {
  return [
  /*
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  */
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  /*
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
  */
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
}