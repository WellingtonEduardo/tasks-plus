import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyA4AY8AqRcwFa4pXSRRWRO7UK7AWrYVIHE',
	authDomain: 'tarefasplus-e92d3.firebaseapp.com',
	projectId: 'tarefasplus-e92d3',
	storageBucket: 'tarefasplus-e92d3.appspot.com',
	messagingSenderId: '320300135719',
	appId: '1:320300135719:web:e4e067d5e2cf91e7796502'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
