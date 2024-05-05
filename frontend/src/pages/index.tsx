import { Inter } from "next/font/google";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { c as _c } from "@codemirror/legacy-modes/mode/clike";
import { StreamLanguage } from "@codemirror/language";
import { useCallback, useState } from "react";
import { aura } from "@uiw/codemirror-theme-aura";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const languages = {
    java: {
      name: "java",
      sampleCode: `
    public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
          `,
    },
    python: { name: "python", sampleCode: 'print("Hello, World!")' },
    c: { name: "c", sampleCode: 'printf("Hello, World!");' },
  };

  const [selectedLanguage, setSelectedLanguage] = useState(languages.java.name);
  const [value, setValue] = useState(languages.java.sampleCode);
  const [languageSupport, setLanguageSupport] = useState([java()]);
  // @ts-ignore
  const onEditorValueChange = useCallback((val, viewUpdate) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem(selectedLanguage, value);
    const lang = e.target.value;
    setSelectedLanguage(lang);
    // @ts-ignore
    const val = TryGetVal(lang);
    setValue(val);
    updateLanguageSupport(lang);
  };

  const TryGetVal = (key: string) => {
    const val = localStorage.getItem(key);
    if (val) {
      return val;
    }
    // @ts-ignore
    return languages[key].sampleCode;
  };

  const updateLanguageSupport = (lang: string) => {
    switch (lang) {
      case "java":
        setLanguageSupport([java()]);
        break;
      case "python":
        setLanguageSupport([python()]);
        break;
      case "c":
        let c = StreamLanguage.define(_c);
        // @ts-ignore
        setLanguageSupport([c]);
        break;
      default:
        setLanguageSupport([]);
    }
  };

  const compile = async () => {
    fetch("http://localhost:8080/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: value,
        lang: selectedLanguage,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response from server", data))
      .catch((error) => console.error(error));
  };
  return (
    <main
      className={`bg-slate-900 flex min-h-screen flex-col justify-normal p-2 ${inter.className}`}
    >
      {/* Add dropdown to switch language mode */}
      <select
        className="mt-4"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e)}
      >
        {Object.keys(languages).map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <CodeMirror
        className="w-full mt-4 p-4"
        value={value}
        height="500px"
        theme={aura}
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
  );
}
