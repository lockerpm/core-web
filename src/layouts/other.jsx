import React, { } from 'react';
import { Layout } from '@lockerpm/design';

import layoutComponents from '../components/layout';

function OtherLayout(props) {
  const { PageContent } = layoutComponents;
  const { routers, pages } = props
  return (
    <Layout className="authlayout">
      <Layout.Content className="authlayout__content">
        <PageContent routers={routers} pages={pages} />
      </Layout.Content>
    </Layout>
  );
}

export default OtherLayout;