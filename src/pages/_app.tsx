import type { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

import '@/styles/globals.css';
import Header from '@/components/Header';


const roboto = Roboto({
	weight: ['400', '500', '700'],
	subsets: ['latin']
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session}>

			<div className={roboto.className}>
				<Header />
				<Component {...pageProps} />
			</div>

		</SessionProvider>
	);
}
