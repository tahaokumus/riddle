import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { useEffect, useState } from 'react';
import styles from '@/styles/Riddle.module.css';

const inter = Inter({ subsets: ['latin'] });

function Qr({ hints, lang, text }: Riddle) {
	const [isHintVisible, setIsHintVisible] = useState(false);

	return (
		<div className={styles.riddle}>
			<h1 className={inter.className}>{text.title}</h1>
			<input
				className={styles.input}
				type='text'
				placeholder={text.your_answer}
			/>
			<button className={styles.submit}>{text.submit}</button>
			{hints?.length &&
				hints.map((hint) => (
					<div className={styles.hint} key={hint.no}>
						<div
							onClick={() => setIsHintVisible(!isHintVisible)}
							className={styles.hintHeader}
						>
							{text.hint}
						</div>
						<div className={isHintVisible ? styles.hintContent : styles.hidden}>
							{hint.img && <img src={hint.img} />}
							{hint.text && <p>{hint.text}</p>}
						</div>
					</div>
				))}
		</div>
	);
}

type Riddle = {
	lang: string;
	text: any;
	hints: Array<{
		no: string;
		img?: string;
		text?: string;
	}>;
};

type Data = {
	id: string;
	data: Array<Riddle>;
};

type Props = {
	props?: Riddle;
	notFound?: Boolean;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<Props> {
	const { query } = context;
	const { id, lang } = query;

	const jsonDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(
		jsonDirectory + '/riddle.json',
		'utf8'
	);
	const json = JSON.parse(fileContents) as Array<Data>;
	const riddles = json.find((riddle) => riddle.id == id);
	const riddle = riddles?.data.find((r) => r.lang == (lang || 'en'));

	if (riddle) {
		return { props: riddle };
	}

	return {
		notFound: true
	};
}

export default Qr;
