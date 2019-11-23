import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Code from '../components/code'

const components = {
  pre: Code
}

const Layout = ({ children }) => (
  <>
    <MDXProvider components={components}>
      <header>Gatsby-theme-owl</header>
      <main>{children}</main>
    </MDXProvider>
  </>
)

export default Layout