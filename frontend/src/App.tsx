import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { BackendHealthBanner } from "./components/BackendHealthBanner";

export default function App() {
  return (
    <>
      <BackendHealthBanner />
      <RouterProvider router={router} />
    </>
  );
}
