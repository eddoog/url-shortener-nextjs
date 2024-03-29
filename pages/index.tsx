import validateUrl from '@/utils/validateURL';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getUrlList } from './api/url';

export default function Home({ urlListProps }: any) {
    const [urlList, setUrlList] = useState(urlListProps);
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    // console.log(urlList);

    async function handleSubmit(e: any) {
        e.preventDefault();
        const urlObj = {
            originalUrl,
            shortUrl,
        };
        const res = await fetch('/api/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(urlObj),
        });
        const data = await res.json();
        if (data) {
            setOriginalUrl('');
            setShortUrl('');
            setUrlList([data, ...urlList]);
        }
    }

    return (
        <>
            <Head>
                <title>Url Shortener</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center flex-col mx-[20%] my-[2rem]">
                    <h1 className="text-3xl font-bold">Shrink your URL!</h1>
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="originalUrl"
                            id="originalUrl"
                            placeholder="Enter your original URL"
                            className=" border-2 border-gray-500 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mt-4 mb-2"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name="shortUrl"
                            id="shortUrl"
                            placeholder="Enter desired short name"
                            className=" border-2 border-gray-500 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-1 mb-2"
                            value={shortUrl}
                            onChange={(e) => setShortUrl(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={validateUrl(originalUrl) ? false : true}
                            className="p-2 font-extrabold rounded-md bg-blue-500 text-white disabled:bg-slate-400 mt-2"
                        >
                            Shrink!
                        </button>
                    </form>
                    <div className="">
                        <table className="text-gray-500 dark:text-gray-400 mt-3">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Original URL</th>
                                    <th className="px-6 py-3">Short URL</th>
                                    <th className="px-6 py-3">Clicked</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {urlList.map((url: any, index: number) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="bg-white border-b dark:bg-gray-700 dark:border-gray-500"
                                        >
                                            <th className="px-6 py-4 font-medium whitespace-nowrap ">
                                                {index + 1}
                                            </th>
                                            <td className="px-6 py-4 text-white">
                                                <Link
                                                    href={url.originalUrl}
                                                    target="_blank"
                                                >
                                                    {url.originalUrl.slice(
                                                        0,
                                                        120
                                                    )}
                                                    {url.originalUrl.length >
                                                    120
                                                        ? '...'
                                                        : ''}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-white">
                                                <Link
                                                    href={`/${url.shortUrl}`}
                                                    target="_blank"
                                                >
                                                    {url.shortUrl}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                {url.clicked}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps() {
    const urlListProps = await getUrlList();
    // console.log(urlListProps);
    return {
        props: {
            urlListProps: JSON.parse(JSON.stringify(urlListProps)),
        }, // will be passed to the page component as props
    };
}
