const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const withDefaults = require('./utils/default-theme-options');
const { urlResolve } = require(`gatsby-core-utils`)

exports.onPreBootstrap = ({ store }, options) => {
  const { program } = store.getState()
  const { contentPath } = withDefaults(options)
  const dir = path.join(program.directory, contentPath)
  if (!fs.existsSync(dir)){
    mkdirp.sync(dir);
  }
}

exports.createSchemaCustomization = ({ node, actions, getNode, createNodeId }, options) => {
  actions.createTypes(`
    type ChordsPage implements Node @dontInfer {
      id: ID!
      title: String!
      path: String!
      updated: Date! @dateformat
      body: String!
    }
  `)
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId}, options) => {
  const { basePath } = withDefaults(options);
  const parent = getNode(node.parent);
  if (
    node.internal.type !== 'Mdx' || 
    parent.sourceInstanceName !== 'gatsby-theme-guitar-chords'
  ) {
    return
  }

  const pageName = parent.name != 'index' ? parent.name : '';

  actions.createNode({
    id: createNodeId(`ChordsPage-${node.id}`),
    title: node.frontmatter.title || parent.name,
    updated: parent.modifiedTime,
    path: urlResolve(basePath, parent.relativeDirectory, pageName),
    parent: node.id,
    internal: {
      type: 'ChordsPage',
      contentDigest: node.internal.contentDigest,
    }
  })
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    ChordsPage: {
      body: {
        type: 'String!',
        resolve: (source, args, context, info) => {
          const type = info.schema.getType('Mdx');
          const mdxFields = type.getFields();
          const resolver = mdxFields.body.resolve;

          const mdxNode = context.nodeModel.getNodeById({ id: source.parent});

          return resolver(mdxNode, args, context, {
            fieldName: 'body',
          });

        }
      }
    }
  })
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    query{
      allChordsPage{
        nodes{
          id
          path
        }
      }
    }
  `)

  if( result.errors){
    reporter.panic('error loading chords', result.errors);
  }

  const pages = result.data.allChordsPage.nodes;

  pages.forEach(page => {
    actions.createPage({
      path: page.path,
      component: require.resolve('./src/templates/chords-page-template.js'),
      context: {
        pageID:  page.id,
      }
    })
  })
}