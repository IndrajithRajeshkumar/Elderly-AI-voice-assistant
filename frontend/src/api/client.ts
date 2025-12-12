export const API_URL = "http://127.0.0.1:8000";

export async function sendChatMessage(message: string) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  return res.json();
}
