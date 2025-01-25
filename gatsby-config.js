module.exports = {
  siteMetadata: {
    title: `Your Site Title`,
    description: `Your site description`,
    author: `@yourhandle`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo1.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`, // Add this line to enable SCSS support
    "gatsby-transformer-remark",
    // other plugins can be added here
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        enableListener: true,
        preconnect: [
          `https://fonts.googleapis.com`,
          `https://fonts.gstatic.com`,
        ],
        web: [
          {
            name: "Tangerine",
            file: "https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap",
          },
        ],
      },
    },
  ],
};
