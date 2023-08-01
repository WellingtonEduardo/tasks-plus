import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

import { doc, getDoc, collection, query, where, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';

import Textarea from '@/components/Textarea';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface TaskSnapshotProps {
  task: string;
  public: boolean;
  created: string;
  user: string;
  taskId: string;
}

interface CommentProps {
  id: string;
  user: string;
  taskId: string;
  name: string;
  comment: string;
}



interface TaskProps {
  item: TaskSnapshotProps,
  allComments: CommentProps[]
}



export default function Task({ item, allComments }: TaskProps) {
	const [input, setInput] = useState<string>('');
	const [comments, setComments] = useState<CommentProps[]>(allComments || []);


	const { data: session } = useSession();



	async function handleComment(event: FormEvent) {
		event.preventDefault();

		if (input === '') {
			return;
		}

		if (!session?.user?.email || !session?.user?.name) {

			return;
		}

		try {

			const docRef = await addDoc(collection(db, 'comments'), {
				comment: input as string,
				created: new Date() as Date,
				user: session.user.email as string,
				name: session.user.name as string,
				taskId: item.taskId as string
			});


			const data = {
				id: docRef.id as string,
				comment: input as string,
				user: session.user.email as string,
				name: session.user.name as string,
				taskId: item.taskId as string
			};

			setComments((oldItems) => [data, ...oldItems]);
			setInput('');

		} catch (error) {
			console.log(error);

		}


	}


	async function handleDeleteComment(id: string) {

		try {

			const docRef = doc(db, 'comments', id);
			await deleteDoc(docRef);

			const deleteComments = comments.filter(comment => comment.id !== id);
			setComments(deleteComments);

		} catch (error) {
			console.log(error);

		}


	}


	return (
		<div className='max-w-5xl w-full mt-10 mx-auto px-4 flex flex-col justify-center items-center mb-5' >
			<Head>
				<title>Detalhes da tarefa</title>
			</Head>

			<main className='w-full'>
				<h1 className='mb-4 font-medium text-2xl'>Tarefa</h1>

				<article className='text-lg flex items-center justify-center border-solid border-gray-600 border rounded p-4'>

					<p className='whitespace-pre-wrap w-full'>{item.task}</p>

				</article>

			</main>

			<section className='my-6 w-full'>

				<h2 className='my-4 text-xl font-medium'>
          Deixar comentário
				</h2>

				<form onSubmit={handleComment}>
					<Textarea
						onChange={(event: ChangeEvent<HTMLTextAreaElement>) => { setInput(event.target.value); }}
						value={input}
						placeholder='Digite seu comentário...'
					/>

					<button
						type='submit'
						disabled={!session?.user}
						className='bg-blue-600 text-white text-lg w-full rounded py-3 hover:bg-blue-500 duration-300 disabled:cursor-not-allowed disabled:bg-blue-300'
					>
            Enviar comentário
					</button>
				</form>

			</section>

			<section className='my-8 w-full'>
				<h2 className='my-4 text-xl font-medium'>
          Todos comentários
				</h2>

				{comments.length === 0 && (
					<p className='text-gray-700 mb-10'>Nenhum comentário encontrado...</p>
				)
				}

				{comments.map((comment) => (
					<article key={comment.id} className='border-solid border-gray-400 border rounded p-4 mb-3'>

						<div className='flex items-center'>

							<label className='bg-gray-300 py-1 px-2 mr-2 rounded'>
								{comment.name}
							</label>

							{comment.user === session?.user?.email && (
								<button onClick={() => { handleDeleteComment(comment.id); }}>
									<FaTrash size={18} className='text-red-600' />
								</button>
							)
							}

						</div>

						<p className='whitespace-pre-wrap mt-3'>
							{comment.comment}
						</p>
					</article>
				))
				}

			</section>


		</div>
	);

}






export const getServerSideProps: GetServerSideProps = async ({ params }) => {

	if (!params?.id) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	const id = params.id as string;

	const docRef = doc(db, 'tasks', id);
	const snapshot = await getDoc(docRef);


	const queryRef = query(
		collection(db, 'comments'),
		where('taskId', '==', id)
	);
	const snapshotComments = await getDocs(queryRef);
	const allComments: CommentProps[] = [];

	snapshotComments.forEach((doc) => {
		allComments.push({
			id: doc.id,
			taskId: doc.data().taskId,
			comment: doc.data().comment,
			name: doc.data().name,
			user: doc.data().user
		});
	});



	if (snapshot.data() === undefined) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	if (!snapshot.data()?.public) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}


	const milliseconds = snapshot.data()?.created?.seconds * 1000;

	const item: TaskSnapshotProps = {
		task: snapshot.data()?.task,
		public: snapshot.data()?.public,
		created: new Date(milliseconds).toLocaleDateString(),
		user: snapshot.data()?.user,
		taskId: id
	};

	return {
		props: {
			item,
			allComments
		}
	};
};
