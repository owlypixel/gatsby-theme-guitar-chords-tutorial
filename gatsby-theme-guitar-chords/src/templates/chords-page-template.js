import React from 'react'
import { graphql } from 'gatsby'
import ChordsPage from '../components/chords-page'

export const query = graphql`
  query ($pageID: String!) {
    chordsPage(id: {eq: $pageID}) {
      title
      updated(fromNow: true)
      body
    }
  }
`

const ChordsPageTemplate = ({ data }) => <ChordsPage page={data.chordsPage} />

export default ChordsPageTemplate;