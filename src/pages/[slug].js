import { ApolloClient, InMemoryCache } from "@apollo/client";
import React from "react";
import { GET_ALL_SLUGS, GET_INDIVIDUAL_POST } from "../graphql/queries";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";

const client = new ApolloClient({
  uri: "http://127.0.0.1:1337/graphql?populate=*",
  cache: new InMemoryCache(),
});

export default function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <MDXRemote {...post.content} />
      <Image src={process.env.NEXT_PUBLIC_UPLOAD_URL+post.imagen} width={400} height={300} alt="imagen" />
    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: GET_ALL_SLUGS,
  });

  const paths = data.blogPosts.data.map((post) => {
    return { params: { slug: post.attributes.urlSlug } };
  });

  console.log(paths);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: GET_INDIVIDUAL_POST,
    variables: { slugUrl: params.slug },
  });

  const attrs = data.blogPosts.data[0].attributes;

  const html = await serialize(attrs.content);

  return {
    props: {
      post: {
        title: attrs.title,
        content: html,
        imagen: attrs.imagen.data.attributes.url
      },
    },
  };
}
