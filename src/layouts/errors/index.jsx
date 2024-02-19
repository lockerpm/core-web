import React, { } from 'react';
import { Layout } from '@lockerpm/design';

import layoutComponents from "../../components/layout"

function ErrorsLayout(props) {
  const { PageContent } = layoutComponents;
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
