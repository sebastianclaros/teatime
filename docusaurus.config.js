// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');

export default {
  title: "Teatime",
  url: "https://sebastianclaros.github.io", // Your website URL
  baseUrl: "/teatime",
  projectName: "sebastianclaros.github.io",
  organizationName: "sebastianclaros",
  trailingSlash: false,
  onBrokenLinks: "log",
  onBrokenMarkdownLinks: "warn",

  plugins: [["drawio", {}]],

  markdown: {
    mermaid: true
  },

  themes: ["@docusaurus/theme-mermaid"],
  i18n: {
    defaultLocale: "es",
    locales: ["es"]
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/", // Serve the docs at the site's root
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/sebastianclaros/teatime/tree/main"
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   readingTime: ({content, frontMatter, defaultReadingTime}) =>
        //     defaultReadingTime({content, options: {wordsPerMinute: 300}}),
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/sebastianclaros/teatime/tree/main',
        // },
        theme: {
          customCss: require.resolve("./docs/custom.css")
        }
      })
    ]
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Teatime",
        logo: {
          alt: "Teatime",
          src: "img/logo.png"
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "configuracion",
            position: "left",
            label: "Configuración"
          },
          {
            type: "docSidebar",
            sidebarId: "ventas",
            position: "left",
            label: "Ventas"
          },
          // {
          //   to: 'blog',
          //   label: 'Blog',
          //   position: 'right'
          // },
          {
            type: "docSidebar",
            sidebarId: "diccionario",
            position: "right",
            label: "Diccionarios"
          }
        ]
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Apis",
            items: [
              // {
              //   label: 'Portabilidad',
              //   to: '/docs/intro',
              // },
            ]
          },
          {
            title: "Arquitectura",
            items: []
          },
          {
            title: "Standards",
            items: []
          }
        ]
      }
      // prism: {
      //   theme: lightCodeTheme,
      //   darkTheme: darkCodeTheme,
      // },
    })
};
