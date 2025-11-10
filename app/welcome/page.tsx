import { Settings } from "@/types/settings"
import { getDocument } from "@/lib/markdown"
import { Separator } from "@/components/ui/separator"
import { Typography } from "@/components/ui/typography"
import { ArticleBreadcrumb } from "@/components/article/breadcrumb"
import { TableOfContents } from "@/components/toc"

export default async function WelcomePage() {
  const res = await getDocument("welcome")

  if (!res) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Welcome content not found</p>
      </div>
    )
  }

  const { frontmatter, content, tocs } = res

  return (
    <div className="flex items-start gap-10">
      <section className="flex-[3]">
        <ArticleBreadcrumb paths={["welcome"]} />
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{frontmatter.title}</h1>
          <p className="text-sm">{frontmatter.description}</p>
          <Separator />
        </div>
        <Typography>
          <section>{content}</section>
        </Typography>
      </section>
      <TableOfContents
        tocs={{ tocs }}
        pathName="welcome"
        frontmatter={frontmatter}
      />
    </div>
  )
}

export async function generateMetadata() {
  const res = await getDocument("welcome")

  if (!res) {
    return {
      title: "Welcome - Medicaps Resources",
      description: "Welcome to Medicaps Resources - Your comprehensive hub for study materials"
    }
  }

  const { frontmatter, lastUpdated } = res

  return {
    title: `${frontmatter.title} - ${Settings.title}`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    ...(lastUpdated && {
      lastModified: new Date(lastUpdated).toISOString(),
    }),
    openGraph: {
      title: `${frontmatter.title} - ${Settings.openGraph.title}`,
      description: frontmatter.description || Settings.openGraph.description,
      url: `${Settings.metadataBase}/welcome`,
      siteName: Settings.openGraph.siteName,
      type: "article",
      images: Settings.openGraph.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    twitter: {
      title: `${frontmatter.title} - ${Settings.twitter.title}`,
      description: frontmatter.description || Settings.twitter.description,
      card: Settings.twitter.card,
      site: Settings.twitter.site,
      images: Settings.twitter.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    alternates: {
      canonical: `${Settings.metadataBase}/welcome`,
    },
  }
}