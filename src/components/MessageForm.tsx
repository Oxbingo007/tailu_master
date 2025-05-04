"use client";
import { useState } from "react";

export default function MessageForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://127.0.0.1:1337/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { name, content } }),
      });
      if (!res.ok) throw new Error("提交失败");
      setSuccess(true);
      setName("");
      setContent("");
    } catch (err: any) {
      setError(err.message || "提交失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center mb-4">
      <input
        type="text"
        placeholder="您的姓名"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border rounded px-3 py-2 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
      />
      <input
        type="text"
        placeholder="留言内容"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="border rounded px-3 py-2 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "提交中..." : "提交"}
      </button>
      {success && <span className="text-green-600 ml-2">提交成功！</span>}
      {error && <span className="text-red-600 ml-2">{error}</span>}
    </form>
  );
}
