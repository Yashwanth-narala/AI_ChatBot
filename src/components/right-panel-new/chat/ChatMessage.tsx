type Props = {
  role: "user" | "ai";
  text: string;
};

export default function ChatMessage({ role, text }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
          isUser
            ? "bg-purple-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {text}
      </div>
    </div>
  );
}