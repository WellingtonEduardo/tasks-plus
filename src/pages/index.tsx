import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { db } from '@/services/firebaseConnection';
import { collection , getDocs } from 'firebase/firestore';

import hero from '@/assets/hero.png';


interface HomeProps{
  comment: number;
  post: number;
}


export default function Home({post , comment}: HomeProps) {

	return (
		<div className='bg-primary w-full h-home flex  justify-center items-center '>

			<Head>
				<title>Tarefas+ | Organize suas tarefas de forma fácil</title>
			</Head>

			<main className='w-full'>

				<div className='flex flex-col items-center justify-center'>
					<Image
						className='max-w-imageHome w-full  object-contain'
						src={hero}
						alt='Logo Tarefas'
						priority
					/>
				</div>

				<h1 className='sm:text-2xl text-base text-white text-center m-7  font-medium '>
          Sistema feito para você organizar <br />
          seus estudos e tarefas
				</h1>


				<div className='max-w-imageHome m-auto flex sm:flex-row sm:gap-0 flex-col gap-4 items-center justify-around'>

					<section className='sm:w-auto w-4/5 text-center bg-white py-3 px-10 rounded hover:scale-105 duration-500'>
						<span>+{post} posts</span>
					</section>

					<section className='sm:w-auto w-4/5 text-center bg-white py-3 px-10 rounded hover:scale-105 duration-500'>
						<span >+{comment} comentários</span>
					</section>

				</div>


			</main>

		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {

	const commentRef = collection(db, 'comments');
	const postRef = collection(db, 'tasks');


	const commentSnapshot = await getDocs(commentRef);
	const postSnapshot = await getDocs(postRef);


	console.log();


	return{
		props:{
			comment: commentSnapshot.size || 0,
			post: postSnapshot.size ||0
		},
		revalidate: 120
	};

};
