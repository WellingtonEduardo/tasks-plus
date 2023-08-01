import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {

	const { data: session, status } = useSession();



	return (
		<header className='w-full h-20 bg-primary flex items-center justify-center'>

			<section className='px-4 w-full max-w-5xl flex items-center justify-between' >

				<nav className='flex items-center sm:flex-row flex-col'>

					<Link href='/'>
						<h1 className={`text-white font-medium text-xl sm:py-0 ${session?.user && 'pb-2'}`}>
              Tarefas<span className='text-red-600 pl-1'>+</span>
						</h1>
					</Link>

					{session?.user && (
						<Link href="/dashboard" className='bg-white text-primary py-1 sm:px-3 px-2  rounded mx-3'>
              Meu Painel
						</Link>
					)

					}

				</nav>
				{status === 'loading' ? (
					<></>
				)
					:
					session ? (
						<button onClick={() => { signOut(); }} className='text-white border-solid border border-white rounded-3xl py-1 sm:px-6 px-4 font-bold hover:scale-105 hover:bg-white hover:text-primary duration-500'>
							{session.user?.name}
						</button>
					)
						:
						(
							<button onClick={() => { signIn('google'); }} className='text-white border-solid border border-white rounded-3xl py-1 px-6 font-bold hover:scale-105 hover:bg-white hover:text-primary duration-500'>
                Acessar
							</button>
						)
				}

			</section>

		</header>
	);
}
