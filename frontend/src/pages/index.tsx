import Image from 'next/image'
import { Inter } from 'next/font/google'
import CodeMirror from '@uiw/react-codemirror'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { c as _c } from '@codemirror/legacy-modes/mode/clike'
import { StreamLanguage } from '@codemirror/language'
import { useCallback, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const languages = {
        java: {
            name: 'java',
            sampleCode: `
    public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello, World!"); 
      }
          `,
        },
        python: { name: 'python', sampleCode: 'print("Hello, World!")' },
        c: { name: 'c', sampleCode: 'printf("Hello, World!");' },
    }

    const [selectedLanguage, setSelectedLanguage] = useState(
        languages.java.name
    )
    const [value, setValue] = useState(languages.java.sampleCode)
    const [languageSupport, setLanguageSupport] = useState([java()])
    // @ts-ignore
    const onEditorValueChange = useCallback((val, viewUpdate) => {
        console.log('val:', val)
        setValue(val)
    }, [])

    const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value
        setSelectedLanguage(lang)
        // @ts-ignore
        setValue(languages[lang].sampleCode)
        updateLanguageSupport(lang)
    }

    const updateLanguageSupport = (lang: string) => {
        switch (lang) {
            case 'java':
                setLanguageSupport([java()])
                break
            case 'python':
                setLanguageSupport([python()])
                break
            case 'c':
                let c = StreamLanguage.define(_c)
                // @ts-ignore
                setLanguageSupport([c])
                break
            default:
                setLanguageSupport([])
        }
    }

    const compile = async () => {
        fetch('http://localhost:8080/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: value,
                lang: selectedLanguage,
            }),
        })
            .then(response => response.json())
            .then(data => console.log('Response from server', data))
            .catch(error => console.error(error))
    }
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Get started by editing&nbsp;
                    <code className="font-mono font-bold">
                        src/pages/index.tsx
                    </code>
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{' '}
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            className="dark:invert"
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>

            {/* Add dropdown to switch language mode */}
            <select
                className="mt-4"
                value={selectedLanguage}
                onChange={e => onLanguageChange(e)}
            >
                {Object.keys(languages).map(lang => (
                    <option key={lang} value={lang}>
                        {lang}
                    </option>
                ))}
            </select>

            <CodeMirror
                className="w-full"
                value={value}
                height="200px"
                extensions={languageSupport}
                onChange={onEditorValueChange}
            />

            <div className="flex justify-center space-x-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={compile}
                >
                    Compile
                </button>
            </div>
        </main>
    )
}
