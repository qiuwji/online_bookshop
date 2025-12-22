import { useEffect } from "react";

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - 知书坊`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
