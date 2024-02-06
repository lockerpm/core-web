import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@lockerpm/design';

import layoutComponents from "../../components/layout"

const { PageContent } = layoutComponents;

function AuthLayout(props) {
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
