import { IPage } from '@thanhpv102/easy-email-core';
import { JSX } from 'react';

export interface IEmailTemplate {
  content: IPage;
  subject: string;
  subTitle: string;
}

declare global {
  function t(key: string): string;
  function t(key: string, placeholder: React.ReactNode): JSX.Element;

  interface Window {
    // translation

    t: (key: string, placeholder?: React.ReactNode) => JSX.Element;
  }
}
