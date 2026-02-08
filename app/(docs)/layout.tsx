import { Footer, Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { SiteNavbar } from '../_components/site-navbar'

export default async function DocsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Layout
      navbar={<SiteNavbar />}
      footer={<Footer />}
      pageMap={await getPageMap()}
      editLink={null}
      feedback={{ content: null }}
    >
      {children}
    </Layout>
  )
}
