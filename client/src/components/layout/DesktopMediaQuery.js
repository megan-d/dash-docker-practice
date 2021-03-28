import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function DesktopMediaQuery(props) {
  const matches = useMediaQuery('(min-width:700px)');

  return matches && props.children
}
