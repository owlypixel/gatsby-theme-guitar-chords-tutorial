import React from 'react'
import { preToCodeBlock } from 'mdx-utils';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import scope from '../scope';

const Code = props => {
  const codeProps = preToCodeBlock(props);

  if(!codeProps) {
    return <pre {...props} />
  } 

  const {codeString, language} = codeProps;

  return codeProps['react-live'] ? (
    <LiveProvider code={codeString} scope={scope} theme={theme}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ) : (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps}) => (
        <pre
          className={className}
          style={style}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span { ...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  ) 
}

export default Code