# Veranderaars

This is the official action center platform of Milieudefensie. All rights reserved.

A modern, multilingual website built with Gatsby.js and React. This project leverages Tolgee for translation management and is optimized for static site deployment on platforms like Netlify.

---

## 🚀 Technologies Used

- **[Gatsby.js](https://www.gatsbyjs.com/):** Static site generator for React
- **[React](https://reactjs.org/):** UI library
- **[GraphQL](https://graphql.org/):** Data querying layer
- **[Tolgee](https://tolgee.io/):** Open-source translation management
- **Node.js & Yarn/NPM:** JavaScript runtime and package management

---

## 🛠️ Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/milieudefensie/veranderaars.git
   cd veranderaars
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env.development` and/or `.env.production` file in the root directory. Example:

   ```env
    DATO_API_TOKEN=
    DATO_ENVIRONMENT=
    REACT_MAPBOX_TOKEN=
    CSL_API_KEY=
    CSL_PATH=
    GOOGLE_SHEETS_CLIENT_EMAIL=
    GOOGLE_SHEETS_PRIVATE_KEY=
    SPREADSHEET_ID=
    GATSBY_TURNSTILE_SITE_KEY=
    TURNSTILE_SECRET_KEY=
    GATSBY_APP_TOLGEE_API_URL=
    GATSBY_APP_TOLGEE_API_KEY=
    GATSBY_APP_TOLGEE_CDN_URL=
    GATSBY_TOLGEE_API_URL=https://app.tolgee.io
    GATSBY_SITE_URL=https://veranderaars.com
   ```

   | Variable                     | Description                                           | Example Value                                |
   | ---------------------------- | ----------------------------------------------------- | -------------------------------------------- |
   | `DATO_API_TOKEN`             | DatoCMS API read-only token                           | `c63a5e...`                                  |
   | `DATO_ENVIRONMENT`           | DatoCMS environment name (optional)                   | `main`                                       |
   | `REACT_MAPBOX_TOKEN`         | Mapbox API access token for map components            | `pk.eyJ1Ijoi...`                             |
   | `CSL_API_KEY`                | ControlShiftLabs API key (Settings > Integrations > API Keys), sent as `Authorization: Bearer` | `cs_aBcDeFgHiJ0123456789kLmNoPqRsT` |
   | `CSL_PATH`                   | Base URL of the CSL instance                          | `https://klimaatmars.milieudefensie.nl`      |
   | `GOOGLE_SHEETS_CLIENT_EMAIL` | Service account email for accessing Google Sheets API | `my-service@project.iam.gserviceaccount.com` |
   | `GOOGLE_SHEETS_PRIVATE_KEY`  | Private key for Google Sheets API (escaped with `\n`) | `-----BEGIN PRIVATE KEY-----\n...`           |
   | `SPREADSHEET_ID`             | ID of the target Google Spreadsheet                   | `1BxiMVs0XRA5n...`                           |
   | `GATSBY_TURNSTILE_SITE_KEY`  | Cloudflare Turnstile site key for frontend forms      | `0x4AAAA...`                                 |
   | `TURNSTILE_SECRET_KEY`       | Secret key for Turnstile validation on backend        | `1x0000...`                                  |
   | `GATSBY_APP_TOLGEE_API_URL`  | Tolgee API URL for in-context translation UI          | `https://app.tolgee.io`                      |
   | `GATSBY_APP_TOLGEE_API_KEY`  | Tolgee API key (used during dev with Tolgee client)   | `abc123xyz`                                  |
   | `GATSBY_APP_TOLGEE_CDN_URL`  | CDN URL for loading Tolgee assets                     | `https://cdn.tolgee.io`                      |
   | `GATSBY_TOLGEE_API_URL`      | Public Tolgee URL used in production                  | `https://app.tolgee.io`                      |
   | `GATSBY_SITE_URL`            | Public site base URL, used for SEO and canonical tags | `https://veranderaars.milieudefensie.nl`     |

---

## 💻 Running the Development Server

```bash
yarn develop
# or
npm run develop
```

The site will be available at [http://localhost:8000](http://localhost:8000).

---

## 🏗️ Building for Production

```bash
yarn build
# or
npm run build
```

To preview the production build locally:

```bash
yarn serve
# or
npm run serve
```

---

## 🚀 Deployment

You can deploy this site to [Netlify](https://www.netlify.com/)

**Netlify:**

- Connect your GitHub repository.
- Set the build command to `yarn build` or `npm run build`.
- Set the publish directory to `public`.
- Add the required environment variables in the Netlify dashboard.

---

## 📁 Folder Structure

```
veranderaars/
├── src/
│   ├── api/                # Custom API logic (e.g., serverless functions or helpers for external APIs)
│   ├── components/         # Reusable and shared React UI components
│   ├── graphql-fragments/  # Centralized GraphQL fragments for queries
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Gatsby page-level components (mapped to routes)
│   ├── styles/             # Global styles, variables, mixins, and component-specific styles
│   ├── templates/          # Gatsby templates for programmatically generated pages
│   └── ...                 # Other source files
├── .env*                   # Environment variable files
├── gatsby-config.js        # Gatsby configuration
├── gatsby-node.js          # Gatsby Node API
├── package.json            # Project metadata and scripts
└── README.md               # Project documentation
```

**Key Files & Directories:**

- `gatsby-config.js`: Main Gatsby configuration, plugins, and site metadata.
- `src/locales/`: Contains translation JSON files for each supported language.
- `.env.development` / `.env.production`: Store environment variables.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
