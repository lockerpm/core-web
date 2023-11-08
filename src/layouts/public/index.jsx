import React, { } from 'react';
import { Layout } from '@lockerpm/design';
import PageContent from '../../routes';

function PublicLayout(props) {
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
