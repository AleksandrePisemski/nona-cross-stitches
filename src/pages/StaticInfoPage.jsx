import { Link } from "react-router"
import NavBar from "../components/layout/NavBar"
import PageWrapper from "../components/layout/PageWrapper"
import { Button } from "../components/ui/button"
import { informationPages } from "./infoPageData"

export default function StaticInfoPage({ page }) {
  const content = informationPages[page]
  return <PageWrapper>
    <NavBar />
    <main className="mx-auto min-h-[60vh] max-w-4xl px-4 pb-16 pt-28 text-PrimaryText sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stitching-rust">{content.eyebrow}</p>
        <h1 className="mt-2 font-header text-3xl font-semibold sm:text-4xl">{content.title}</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-PrimaryText/75">{content.intro}</p>
      </header>
      <div className="space-y-4">
        {content.sections.map(({ title, text }) => <section key={title} className="rounded-xl border border-stitching-wood/50 bg-page p-5 sm:p-6">
          <h2 className="font-header text-xl font-semibold">{title}</h2>
          <p className="mt-2 leading-relaxed text-PrimaryText/75">{text}</p>
        </section>)}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button render={<Link to="/catalog" />} className="bg-stitching-navy text-white hover:bg-stitching-rust">Browse the catalog</Button>
        <Button render={<Link to="/delivery-payment" />} variant="outline" className="border-stitching-wood">Delivery &amp; Payment</Button>
      </div>
    </main>
  </PageWrapper>
}
