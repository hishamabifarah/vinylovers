// project setup
  /** Dependencies install command:
    npm i lucia @lucia-auth/adapter-prisma prisma @prisma/client @tanstack/react-query @tanstack/react-query-devtools @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/pm uploadthing @uploadthing/react arctic date-fns ky next-themes react-cropper react-image-file-resizer react-intersection-observer react-linkify-it stream-chat stream-chat-react --legacy-peer-deps */  
    /** Dev dependencies install command:
      npm i -D prettier eslint-config-prettier prettier-plugin-tailwindcss --legacy-peer-deps */
      /** Shadcn components add command:
      npx --legacy-peer-deps shadcn-ui@latest add button dialog dropdown-menu form input label skeleton tabs textarea toast tooltip */

      // React Query:
   /**  lib allows to fetch data and cache it , revalidate it and allows infite loading
    implement optimistc updates, ex: toggle like button immediality 
    another ex: when we click follow for a user, their count automaticaly changes and the follow button everuwhere becomes 'unfollow'
    cache feed: when we click on feed to fatch the data, it's cahched so it shows right away and at the same time
    it goes ahead and refetches data in the background and updates in the background
    when we add a new post and in order not to wait for the while feed to refresh we mutate the cache
    */

// React 19 compiler is not used here, remember the learn it when it becomes part of nextjs15

//shadcn makes it easy to customize components because its code is in our project

// when we install tailwindcss inteliisense we go to settings and search for file associations and '*.css' with value tailwind
// that way adds tailwind support to css files so the extension works.
// then go to settings editor quick suggestions and change strings value to 'on' because tailwind classes are strings and we get 
// automatic autocomplete suggestions for tailwind classess

// to use prettier with tailwind we create file prettier.config.js in root folder, 
// then in settings > editor : default formatter we choose prettier     
// then we add the string  "prettier" to .eslintrc.json which makes sure eslint works with prettier

// code in root layout.tsx:
// template %s will display the page title we are one then " | bugbook "
// default should be in the title object 

//client side router does not cache pages anymore by deault like it used in nextjs versions <15
// when we navigated between different pages they are stored in client side cache for 30 seconds
// this makes pages load faster and we need this in this project cause most of data does not need to update on each navigation
// so we override the new default in nextjs15 so we can use this mechanism in our project
// to enable this caching again: next.config.mjs file in experimental object.

/** Setup database and prisma */
 // create new postgres db on vercel
 // setup prisma in the root of our project : npx prisma init , create .env file and prisma folder
 // take env.local code from vercel db and paste it in env file
 // take prisma code from vercel and put it in schema.prisma (replace datasource db )
 // add  previewFeatures = ["fullTextSearch"] to schema.prismafile
 // create new file to interact with prisma database, inside lib folder , prisma.ts
 // the code inside in the file is from prisma doc : https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

/** auth with lucia */
// auth needs 2 tables, user and session, lucia is session based not jwt based like next auth which has both
// after we create our models we : npx prisma db push to sync tables with db (any time we change in db we have to run this comment)
// next we set up an auth.ts file as per lucia docs (notes in file)

// Zod validation can be used on front and backend

// add serverExternalPackages: ["@node-rs/argon2"], to next.config.js as per lucia docs it needs this package to work

//page.tsx inside signup is a server componenet rendered on the server thats why we can set metadata
// we create the SignupForm in another file with "use client" which makes it a client component, beacuse we need javascript

// npx prisma studio opens a window with all models and data in them to browse.


/** Setup dark/light theme */
// import { ThemeProvider } from "next-themes" in main layout
// wrap main layout with ThemeProvider:
/**       <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider> */
//

/** ReactQuery */
// caches data, revalidate data when it's state , 
// avoid race conditions when using useEffect to fetch data (https://medium.com/@ak.akki907/understanding-and-avoiding-race-conditions-in-node-js-applications-fb80ba79d793) 
// easy to implement inifinite loading and optimistic updates
// responsible for server state only
// runs on the client only , we have to setup server endpoints we can make requests to to fetch the pages

// if we have a contextprovider we need the children because this is a contextprovider that we wrap around components


// queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
// below code can be replaced with queryFn above using ky :
// queryFn: async () => {
//   const res = await fetch("/api/posts/for-you");
//   if (!res.ok) {
//     throw Error(`Request failed with status code ${res.status}`);
//   }
//   return res.json();
// },


// 5:03:15 comment notification

