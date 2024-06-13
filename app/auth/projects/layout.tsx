import { Header } from '@/components/Header';
import HttpClient from '@/app/auth/apis/server';

async function getProjects() {
  return await HttpClient.getProjects();
}

export default async function VideosLayout(props: any) {
  const projects = await getProjects();
  return (
    <>
      <div className="flex flex-col items-center">
        <div style={{ display: 'none' }}>
          <div data-store="apiServer">{process.env.API_SERVER}</div>
          <div data-store="batchApiServer">{process.env.BATCH_API_SERVER}</div>
        </div>

        <Header projectList={projects || []} />
        {props.children}
      </div>
    </>
  );
}
