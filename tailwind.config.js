/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#0f0f0f',

			},
			maxWidth: {
				imageHome: '480px'
			},
			height: {
				home: 'calc(100vh - 80px)'
			}

		},
	},
	plugins: [],
};
