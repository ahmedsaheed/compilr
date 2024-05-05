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
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
`,
    },
    python: {
      name: "python",
      sampleCode: `
 # Python Program to find the area of triangle

a = 5
b = 6
c = 7

# Uncomment below to take inputs from the user
# a = float(input('Enter first side: '))
# b = float(input('Enter second side: '))
# c = float(input('Enter third side: '))

# calculate the semi-perimeter
s = (a + b + c) / 2

# calculate the area
area = (s*(s-a)*(s-b)*(s-c)) ** 0.5
print('The area of the triangle is %0.2f' %area)
`,
    },
    c: {
      name: "c",
      sampleCode: `
#include <stdio.h>

int main() {
  int number1, number2, sum;

  number1 = 10;
  number2 = 20;

  // calculate the sum
  sum = number1 + number2;

  printf("%d + %d = %d", number1, number2, sum);
  return 0;
}`,
    },
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages.java.name,
  );
  const [value, setValue] = useState<string>(languages.java.sampleCode);
  const [languageSupport, setLanguageSupport] = useState([java()]);
  const [compiledResult, setCompiledResult] = useState<string>("");
  const [errorResp, setErrorResp] = useState<boolean>(false);

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
    setCompiledResult("");
    setErrorResp(false);
    const progress = document.getElementById("progress");
    progress && progress.classList.remove("hidden");
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
      .then((data) => {
        const { compiledResult } = data;
        const { output, error } = compiledResult;
        if (error) {
          console.log("Error");
          setCompiledResult(error);
          setErrorResp(true);
          progress && progress.classList.add("hidden");
          return;
        }
        setCompiledResult(output.trim());
        progress && progress.classList.add("hidden");
        console.log("Response from server", data);
      })
      .catch((error) => console.error(error));
  };
  return (
    <main
      className={`bg-slate-900 flex min-h-screen flex-col justify-normal p-2 ${inter.className}`}
    >
      <div className="w-full flex items-center justify-between p-4">
        <h2 className=" pb-2 mt-4 p-4 text-xl text-white">Editor</h2>
        {/* Add dropdown to switch language mode */}
        <select
          className="mt-4 bg-transparent text-white border border-white p-2 rounded"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e)}
        >
          {Object.keys(languages).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <CodeMirror
        className="w-full mt-4 p-4 "
        style={{ fontSize: 18 }}
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

      <div id="progress" className="hidden text-white text-center mx-auto mt-4">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {compiledResult != "" && (
        <div className="mt-4 p-4">
          <h2 className=" pb-2 text-xl text-white">Compiled Result</h2>
          <pre
            className={
              errorResp
                ? "bg-slate-800 p-4 text-red-500"
                : "bg-slate-800 p-4 text-white"
            }
          >
            {compiledResult}
          </pre>
        </div>
      )}
    </main>
  );
}
