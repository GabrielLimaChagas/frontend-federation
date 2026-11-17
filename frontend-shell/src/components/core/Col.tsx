import type { HTMLAttributes } from "react";

const Col: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div {...props} className={`flex flex-col ${className || ""}`}>
    {children}
  </div>
);

export default Col;
