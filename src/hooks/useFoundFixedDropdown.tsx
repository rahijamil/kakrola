import React, { useEffect, useState } from "react";

const useFoundFixedDropdown = () => {
  const [foundFixedDropdown, setFoundFixedDropdwon] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const fixedDropdown = document.getElementById("fixed_dropdown");
      setFoundFixedDropdwon(!!fixedDropdown);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const fixedDropdown = document.getElementById("fixed_dropdown");
    setFoundFixedDropdwon(!!fixedDropdown);

    return () => observer.disconnect();
  }, []);

  return { foundFixedDropdown };
};

export default useFoundFixedDropdown;
