

import Head from 'next/head'
import Link from 'next/link';
import Image from 'next/image'
import { GET_ALL_POSTS } from '../graphql/queries';
import { ApolloClient, InMemoryCache } from '@apollo/client';

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Mi Pequeño blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Bienvenido a mi Blog de Codigos</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu metus
        turpis. Cras posuere blandit erat, eu maximus erat rutrum ac. Aenean
        suscipit et ligula nec feugiat. Sed maximus purus nunc, ut sagittis
        neque placerat ac.{" "}
      </p>
      <br />
      <h2>All posts</h2>
      <br />
      {posts.map((val, i) => {
        return (
          <Link key={i} href={val.attributes.urlSlug}>          
            <div className="card">
              <h3>{val.attributes.title}</h3>
              <p>{val.attributes.description}</p>
              <Image src={process.env.NEXT_PUBLIC_UPLOAD_URL+val?.attributes?.imagen?.data?.attributes?.url } width={150} height={100} alt="imagen"/>              
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "http://127.0.0.1:1337/graphql?populate=*",
    cache: new InMemoryCache()
  });
  const { data } = await client.query({
    query: GET_ALL_POSTS,
  });

  return {
    props: {
      posts: data.blogPosts.data,
    },
  };
}
