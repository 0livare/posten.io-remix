import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from 'remix'
import type {MetaFunction} from 'remix'
import tailwind from './tailwind.css'
import reset from './styles/reset.css'

export const meta: MetaFunction = () => {
  return {title: 'New Remix App'}
}

export function links() {
  return [
    {rel: 'stylesheet', href: tailwind},
    {rel: 'stylesheet', href: reset},
  ]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-slate-800 dark:text-gray-100">
        <div id="root">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
