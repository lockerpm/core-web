import React from "react";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import common from "../../utils/common";

const RouterLink = (props) => {
  const {
    className = '',
    routerName = '',
    routerParams = {},
    routerQuery = {},
    label = '',
    blank = false,
    maxWidth = '100%',
    flex = 1,
    icon = null,
    type = 'primary',
  } = props;

  const currentRouter = common.getRouterByName(routerName)
  const newPath = currentRouter ? common.convertQueryToString(
    common.getRouterParams(currentRouter?.path, routerParams),
    routerQuery
  ) : '/';

  const isMobile = useSelector((state) => state.system.isMobile);
  
  return (
    <Link
      className={`cs-link ${className} text-${type} ${icon ? 'flex items-center' : ''}`}
      style={{ maxWidth: maxWidth, flex: flex }}
      target={blank ? '_blank' : ''}
      to={newPath}
    >
      <span
        title={label}
        className={`text-limited ${isMobile ? 'text-limited__block' : ''}`}
      >
        {label}
      </span> {icon}
    </Link>
  );
}

export default RouterLink;