// app/index.tsx
import { router, type Href } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    router.replace("/(app)/(screens)/" as Href); // absolute route (groups are ignored)
  }, []);
  return null;
}
