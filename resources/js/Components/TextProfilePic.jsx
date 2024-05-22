import React from "react";

const TextProfilePic = ({
  bg = "primary",
  text = "OS",
  fluid = false,
  className,
  size = "md",
}) => {
  const truncatedText = text.length > 2 ? `${text.substring(0, 2)}...` : text;

  return (
    <div
      className={`text-profile-pic bg-${bg} ${
        fluid ? "fluid" : ""
      } ${className} ${size} `}
    >
      {truncatedText}
    </div>
  );
};

export default TextProfilePic;
