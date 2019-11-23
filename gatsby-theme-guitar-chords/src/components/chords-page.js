import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from './layout';

const ChordsPage = ({ page }) => (
  <Layout>
    <h1>{page.title}</h1>
    <MDXRenderer>{page.body}</MDXRenderer>
    <p>This page was updated {page.updated}</p>
  </Layout>
)

export default ChordsPage