import { HTMLProps } from 'react';

export default function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {

	return (

		<textarea className='w-full resize-none h-40 border-solid border-gray-600 border  rounded-lg p-2'
			{...rest}
		>



		</textarea>

	);
}
