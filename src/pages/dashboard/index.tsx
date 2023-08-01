import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';

import { db } from '@/services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';


import Textarea from '@/components/Textarea';
import Tasks from '@/components/Tasks';

interface DashboardProps {
  user: {
    email: string;
  }
}


interface TaskFileProps {
  task: string;
  created: Date;
  user: string;
  public: boolean;
}




export default function Dashboard({ user }: DashboardProps) {

	const [input, setInput] = useState<string>('');
	const [publicTask, setPublicTask] = useState<boolean>(false);



	function handleChangePublicTask(event: ChangeEvent<HTMLInputElement>) {

		setPublicTask(event.target.checked);
	}


	async function handleRegisterTask(event: FormEvent) {
		event.preventDefault();

		if (input === '') {
			return;
		}

		try {

			const taskFile: TaskFileProps = {
				task: input,
				created: new Date(),
				user: user.email,
				public: publicTask
			};

			await addDoc(collection(db, 'tasks'), taskFile);

			setInput('');
			setPublicTask(false);


		} catch (error) {
			console.log(error);

		}

	}




	return (
		<div className='w-full'>

			<Head>
				<title>Meu painel de tarefas</title>
			</Head>

			<main className='mb-14'>
				<section className='bg-primary w-full flex justify-center items-center'>
					<div className='max-w-screen-lg w-full px-4 pb-8 mt-14'>
						<h1 className='text-white mb-2'>Qual sua tarefa?</h1>

						<form onSubmit={handleRegisterTask}>

							<Textarea
								placeholder='Digite qual sua tarefa...'
								value={input}
								onChange={(event: ChangeEvent<HTMLTextAreaElement>) => { setInput(event.target.value); }}

							/>

							<div className='flex items-center my-4'>
								<input
									type="checkbox"
									className='w-4 h-4'
									onChange={handleChangePublicTask}
									checked={publicTask}
								/>

								<label className='ml-2 text-white'>Deixar tarefa publica?</label>
							</div>

							<button type='submit' className='bg-blue-600 text-white text-lg w-full rounded py-3 hover:bg-blue-500 duration-300'>
                Registrar
							</button>

						</form>

					</div>
				</section>

				<Tasks user={user} />


			</main>

		</div>
	);
}



export const getServerSideProps: GetServerSideProps = async ({ req }) => {

	const session = await getSession({ req });

	if (!session?.user) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}


	return {
		props: {
			user: {
				email: session.user.email
			}
		}
	};

};
