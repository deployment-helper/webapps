import { redirect } from 'next/navigation';

// Redirect to /auth
export default function Page() {
  redirect('/auth');
}
