import React, { } from 'react';
import { Layout } from '@lockerpm/design';

import layoutComponents from "../../components/layout"

const { PageContent } = layoutComponents;

function ErrorsLayout(props) {
  const { routers, pages } = props
  return (
    <Layout className="errors-layout">
      <Layout.Content className="errors-layout__content">
        <PageContent routers={routers} pages={pages} />
      </Layout.Content>
    </Layout>
  );
}

export default ErrorsLayout;
