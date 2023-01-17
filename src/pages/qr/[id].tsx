import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { useEffect } from 'react';
import styles from '@/styles/Qr.module.css';

const inter = Inter({ subsets: ['latin'] });

function Qr(data: Data) {
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			router.push(data.url + `?lang=${data.lang}`);
		}, 5000);
	}, [router, data.url, data.lang]);

	const lang = data.lang ? `?lang=${data.lang}` : '';

	return (
		<div className={styles.text}>
			<p className={inter.className}>
				You will be redirected to:
				<strong> &quot;{data.url + lang}&quot; </strong>
        in 5 seconds
			</p>
		</div>
	);
}

type Data = {
	id: string;
	url: string;
	lang: string;
};

type Props = {
	props?: Data;
	notFound?: Boolean;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<Props> {
	const { query } = context;
	const { id, lang } = query;

	console.log(query);

	const jsonDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(jsonDirectory + '/qr.json', 'utf8');
	const json = JSON.parse(fileContents) as Array<Data>;
	let qr = json.find((qr) => qr.id == id);

	if (qr) {
		qr.lang = lang?.toString() ?? '';
		return { props: qr };
	}

	return {
		notFound: true
	};
}

export default Qr;
