import React, { } from 'react';
import { Layout } from '@lockerpm/design';

import layoutComponents from "../../components/layout"

function PublicLayout(props) {
  const { PageContent } = layoutComponents;
  const { routers, pages } = props
  return (
    <Layout className="public-layout">
      <Layout.Content className="public-layout__content">
        <PageContent routers={routers} pages={pages} />
      </Layout.Content>
    </Layout>
  );
}

export default PublicLayout;
