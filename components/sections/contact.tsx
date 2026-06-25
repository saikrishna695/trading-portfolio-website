import { AtSign, Globe, Mail, MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Card, CardContent } from '@/components/ui/card'
import { PROFILE, RESOURCES } from '@/lib/sample-data'

export function Contact() {
  const links = [
    {
      label: 'LinkedIn',
      href: PROFILE.socials.linkedin,
      icon: Globe,
      handle: 'Connect',
    },
    {
      label: 'Twitter / X',
      href: PROFILE.socials.twitter,
      icon: AtSign,
      handle: 'Follow',
    },
    {
      label: 'Discord',
      href: PROFILE.socials.discord,
      icon: MessageCircle,
      handle: 'Message',
    },
    {
      label: 'Email',
      href: `mailto:${PROFILE.email}`,
      icon: Mail,
      handle: PROFILE.email,
    },
  ]

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Get in touch"
        title="Connect & resources"
        description="Reach out on any platform below, or take a look at the tools and platforms I rely on."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <link.icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium text-foreground">
                    {link.label}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {link.handle}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Tools & platforms I use
              </h3>
              <dl className="mt-4 space-y-3">
                {RESOURCES.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-muted-foreground">{r.label}</dt>
                    <dd className="text-right text-sm font-medium text-foreground">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
