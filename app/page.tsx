"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { ModelType } from "../components/DropDown";
import LoadingDots from "../components/LoadingDots";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";
import aiPrompt from "../components/AIPrompt";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [postDescription, setPostDescription] = useState("");
  const [model, setModel] = useState<ModelType>("meta-llama/Llama-3.3-70B-Instruct-Turbo-Free");
  const [generatedComments, setGeneratedComments] = useState<String>("");

  const commentRef = useRef<null | HTMLDivElement>(null);

  const scrollToComments = () => {
    if (commentRef.current !== null) {
      commentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const generateAIComment = async (e: any) => {
    e.preventDefault();
    setGeneratedComments("");
    setLoading(true);

    const prompt = aiPrompt(postDescription, model);

    const response = await fetch("/api/together", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok) throw new Error(response.statusText);

    const runner = ChatCompletionStream.fromReadableStream(response.body!);
    runner.on("content", (delta) => setGeneratedComments((prev) => prev + delta));

    scrollToComments();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Test Model Generator Komentar AI 
        </h1>

        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">
              Deskripsi Post{" "}
              <span className="text-slate-500">(masukkan deskripsi postingan sosmed)</span>.
            </p>
          </div>
          <textarea
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"ex : Unboxing skincare viral yang katanya bisa bikin glowing dalam 7 hari!"}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Pilih model untuk digunakan.</p>
          </div>
          <DropDown model={model} setModel={setModel} />
          {loading ? (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          ) : (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateAIComment(e)}
            >
              Generate Comment &rarr;
            </button>
          )}
        </div>

        <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2000 }} />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedComments && (
            <>
              <div>
                <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto" ref={commentRef}>
                  Your generated comment
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedComments
                  .substring(generatedComments.indexOf("1") + 3)
                  .split(/2\.|3\./)
                  .map((generatedComment) => (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedComment);
                        toast("Comment copied to clipboard", { icon: "✂️" });
                      }}
                      key={generatedComment}
                    >
                      <p>{generatedComment}</p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
