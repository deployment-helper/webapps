import { Header } from '@/components/Header';
import { ReactNode } from 'react';

export default function VideosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div style={{ display: 'none' }}>
          <div data-store="apiServer">{process.env.API_SERVER}</div>
          <div data-store="batchApiServer">{process.env.BATCH_API_SERVER}</div>
        </div>

        <Header title="Dashbord" projectList={[]} />
        {children}
      </div>
    </>
  );
}
