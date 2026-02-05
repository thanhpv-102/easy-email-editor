import { PageHeader, PageHeaderProps } from '@arco-design/web-react';
import React from 'react';
import { useHistory } from 'react-router-dom';

export interface HeaderProps extends Omit<PageHeaderProps, 'onBack'> {
  backUrl?: string;
  title: React.ReactNode;
}

export const Header = (props: HeaderProps) => {
  const history = useHistory();
  const { backUrl } = props;
  return (
    <PageHeader
      {...props}
      onBack={backUrl ? () => history.replace(backUrl) : undefined}
    />
  );
};
