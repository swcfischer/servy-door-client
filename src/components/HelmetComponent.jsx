import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function HelmetComponent(props) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const title = props.title || data.site.siteMetadata.title;
  const description = props.description || data.site.siteMetadata.description;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="Steve Fischer" />
      <meta
        name="keywords"
        content="reading, focus, concentration, books, literature, writing, community"
      />
    </Helmet>
  );
}

export default HelmetComponent;
