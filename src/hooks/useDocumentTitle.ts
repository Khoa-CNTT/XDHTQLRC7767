import { useEffect } from "react";

/**
 * A custom hook to update the document title
 * @param title - The title to set for the page
 * @param suffix - Optional suffix to append to the title
 */
const useDocumentTitle = (
  title: string,
  suffix: string = "| BSCMSAAPUE Cinema"
) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} ${suffix}`;

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

export default useDocumentTitle;
