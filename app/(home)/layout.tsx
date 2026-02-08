import { Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { SiteNavbar } from '../_components/site-navbar'

export default async function HomeLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Layout
      navbar={<SiteNavbar />}
      pageMap={await getPageMap()}
      footer={null}
      editLink={null}
      feedback={{ content: null }}
    >
      {children}
    </Layout>
  )
}
