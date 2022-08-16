import { Html, Main, NextScript, Head } from 'next/document';
import React from 'react';

const Document = () => {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />

        <div id='modal-root'></div>
      </body>
    </Html>
  );
};

export default Document;
