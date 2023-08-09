import Head from "next/head";
import Link from "next/link";

export default function Page2() {
    return (
        <div>
        <Head>
            <title>Page 2</title>
        </Head>
        <Link href="/">Home Page</Link>
        <h1>Page 2</h1>        
        </div>
    )
    }