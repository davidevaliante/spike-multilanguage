import React, { FunctionComponent, Fragment } from "react";
import styled from "styled-components";

interface ILogo {}

const Logo: FunctionComponent<ILogo> = ({}) => {
  const LogoObject = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://spikeslot.com",
    logo: "https://spikeslot.com/icons/app_icon.svg",
  });

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(LogoObject()) }}
      type="application/ld+json"
    />
  );
};

export default Logo;
