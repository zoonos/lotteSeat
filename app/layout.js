import WrapApp from './WrapApp'
import './globals.css'
import { Inter } from 'next/font/google'
import styles from './layout.module.css';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Header, Nav, ContTitle, YearMonth, Footer } from '@/component/layout/layout';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '롯데 콘서트 홀 좌석 배치',
  description: '롯데 콘서트 홀 좌석 배치를 위한 프로그램',
}

export default async function RootLayout({ children }) {
  let session = await getServerSession(authOptions);
  return (
      <html lang="en">
        <body className={inter.className} style={{padding: 10}}>
          <WrapApp>
            { 
              session ? 
              // 세션 있는 경우
              <div className={styles.wrap}>
                <Header user={session?.user}/>
                <div>
                    <Nav/>
                    <div>
                        <div className={styles.contentTop}>
                            <ContTitle/>
                            <YearMonth/>
                        </div>
                        <div className={styles.content}>{children}</div>
                    </div>
                </div>
                <Footer/>
              </div> : 
              // 세션 없는 경우
              <div>
                {children}
              </div>
            }
          </WrapApp>
        </body>
      </html>
  )
}