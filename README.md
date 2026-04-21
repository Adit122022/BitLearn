This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



```bash
# this command has issue in my system
# When you run pnpm dlx prisma, pnpm automatically ignores the version of Prisma you have installed in your project (which is v6.16.2) and downloads the latest available version from the npm registry (which is currently v7.7.0).

# Prisma v7 introduced a major breaking change where they removed the url connection property from the schema.prisma file, requiring it to be moved to a new prisma.config.ts file instead. Because pnpm dlx grabbed Prisma v7, it tried to parse your Prisma v6 schema using Prisma v7 engine rules and threw that validation error.

 pnpm dlx prisma db push   -> push command in  prisma orm

# run the version of Prisma that is already installed in your project (v6.x) instead of downloading the newest one.

# To do this, stop using dlx and simply run Prisma through your package manager using exec or just directly:
pnpm prisma db push
# OR
pnpm exec prisma db push

```