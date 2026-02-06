import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

export interface HeaderProps {
  backUrl?: string;
  title: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Header = (props: HeaderProps) => {
  const history = useHistory();
  const { backUrl, title, extra, ...rest } = props;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        gap: 12,
        ...rest.style,
      }}
    >
      {backUrl && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => history.replace(backUrl)}
        />
      )}
      <h3 style={{ margin: 0, flex: 1 }}>{title}</h3>
      {extra && <div>{extra}</div>}
    </div>
  );
};
