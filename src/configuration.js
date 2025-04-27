let BACKEND_URL = "";

if (process.env.NODE_ENV === "development") {
  BACKEND_URL = "http://localhost:5000/api";
} else if (process.env.NODE_ENV === "production") {
  BACKEND_URL = "https://namo-chat.vercel.app/api";
} else {
  BACKEND_URL = "https://namo-chat.vercel.app/api";
}

export default BACKEND_URL;
