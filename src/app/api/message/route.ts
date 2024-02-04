import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { NextRequest } from "next/server";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

interface SearchResult {
  pageContent: string;
  metadata: {
    fileName: string;
  };
}

function customFilter(result: SearchResult, targetFileName: string): boolean {
  return result.metadata?.fileName === targetFileName;
}

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a PDF file

  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const { id: userId } = user;
  if (!userId) return new Response("unauthorized", { status: 401 });

  // const { fileId, message } = SendMessageValidator.parse(body);
  
  const {fileId,message}=body;
  console.log("body",body);

  console.log("fileId",fileId);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  console.log("file1",file);

  if (!file) return new Response("Not Found", { status: 404 });

  const msgCrt=await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  console.log("msgCrt",msgCrt)

  // 1: Vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const pineconeIndex = pinecone.Index("docmate"); // Use a single index name

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    //@ts-ignore
    pineconeIndex,
  });

  const results = await vectorStore.similaritySearch(message, 4);
  console.log("results",results);
  const prevMessage = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  console.log("prevMessage====>",prevMessage)

  const formattedPrevMessages = prevMessage.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  console.log("formattedPrevMessages====>",formattedPrevMessages)

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
      
\n----------------\n

PREVIOUS CONVERSATION:
${formattedPrevMessages.map((message) => {
  if (message.role === "user") return `User: ${message.content}\n`;
  return `Assistant: ${message.content}\n`;
})}

\n----------------\n

CONTEXT:
${results.map((r) => r.pageContent).join("\n\n")}

USER INPUT: ${message}`,
      },
    ],
  });

  console.log(response);

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      });
    },
  });
  
  return new StreamingTextResponse(stream);
};