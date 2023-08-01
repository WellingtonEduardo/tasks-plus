import Link from 'next/link';
import { useEffect, useState } from 'react';

import { db } from '@/services/firebaseConnection';
import { collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';


import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';


interface DashboardProps {
  user: {
    email: string;
  }
}


interface TasksProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}


export default function Tasks({ user }: DashboardProps) {

	const [tasks, setTasks] = useState<TasksProps[]>([]);



	useEffect(() => {

		async function loadTasks() {

			try {

				const q = query(
					collection(db, 'tasks'),
					orderBy('created', 'desc'),
					where('user', '==', user.email)
				);


				onSnapshot(q, (snapshot) => {
					const listTasks: TasksProps[] = [];

					snapshot.forEach((doc) => {
						listTasks.push({
							id: doc.id,
							task: doc.data().task,
							created: doc.data().created,
							user: doc.data().user,
							public: doc.data().public
						});
					});

					setTasks(listTasks);
				});

			} catch (error) {

				console.log(error);

			}

		}

		loadTasks();

	}, []);




	async function handleShare(id: string) {

		await navigator.clipboard.writeText(
			`${process.env.NEXT_PUBLIC_URL}/task/${id}`
		);
		alert('URL copiada com sucesso!');
	}



	async function handleDeleteTask(id: string) {
		const docRef = doc(db, 'tasks', id);

		await deleteDoc(docRef);


	}



	return (
		<section className='max-w-screen-lg w-full px-4 mt-8 flex flex-col m-auto'>

			<h1 className='text-center text-4xl mb-5'>Minhas tarefas</h1>

			{tasks.map(task => (
				<article key={task.id} className='mb-3 text-lg flex flex-col items-start border-solid border-gray-600 border rounded p-3'>

					{task.public && (
						<div className='flex items-center justify-center mb-2'>
							<label className='text-xs bg-blue-600 text-white rounded py-1 px-2'>
                PUBLICO
							</label>
							<button className='text-blue-600 mx-2' onClick={() => { handleShare(task.id); }}>
								<FiShare2 size={22} />
							</button>
						</div>
					)}

					<div className='flex items-center justify-between w-full'>

						{task.public ? (
							<Link href={`/task/${task.id}`}>
								<p className='whitespace-pre-wrap'>{task.task}</p>
							</Link>
						) : (
							<p className='whitespace-pre-wrap'>{task.task}</p>
						)}

						<button className='mx-2' onClick={() => { handleDeleteTask(task.id); }}>
							<FaTrash size={24} className='text-red-600' />
						</button>

					</div>

				</article>
			))
			}

		</section>
	);
}



