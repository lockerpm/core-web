import React, { } from 'react';
import { Layout } from '@lockerpm/design';

import layoutComponents from "../../components/layout"

function AuthLayout(props) {
  const { PageContent } = layoutComponents;
  const { routers, pages } = props
  return (
    <Layout className="auth-layout">
      <Layout.Content className="auth-layout__content">
        <PageContent routers={routers} pages={pages} />
      </Layout.Content>
    </Layout>
  );
}

export default AuthLayout;
