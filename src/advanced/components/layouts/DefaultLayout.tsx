import { ReactNode } from "react";
import { Header } from "./Header";

interface HeaderProps {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

interface DefaultLayoutProps {
  topContent?: ReactNode;
  headerProps: HeaderProps;
  children: React.ReactNode;
}

export const DefaultLayout = ({
  topContent,
  headerProps,
  children,
}: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {topContent}

      <Header {...headerProps} />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
