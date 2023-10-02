import React, { FunctionComponent, useContext } from "react";
import styled from "styled-components";
import { AppTheme } from "../../theme/theme";
import Link from "next/link";
import { LocaleContext } from "./../../context/LocaleContext";

interface Props {
  color?: string;
  text?: string;
  href: string;
  as?: string;
  external?: string;
  noFade?: boolean;
  nofollow?: boolean;
}

const FadeBorderButton: FunctionComponent<Props> = ({
  color,
  text,
  href,
  as,
  external,
  noFade = false,
  nofollow = false,
}) => {
  const { t } = useContext(LocaleContext);

  return (
    <ButtonStyleProvider color={color} noFade={noFade}>
      {nofollow
        ? (
          <a rel="nofollow" href={as} className="button fade-button-effect">
            <span>{text ? text : t("Free Game")}</span>
          </a>
        )
        : (
          <a href={as} className="button fade-button-effect">
            <span>{text ? text : t("Free Game")}</span>
          </a>
        )}
    </ButtonStyleProvider>
  );
};

interface StyledButtonProps {
  color?: string;
  theme: AppTheme;
  noFade: boolean;
}

const ButtonStyleProvider = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 0.7rem;

    a {
        display: inline-block;
        min-width: 178px;
        box-sizing: border-box;
        appearance: none;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: ${(props: StyledButtonProps) => {
  if (props.color) return `2px solid ${props.color}`;
  else return `2px solid ${props.theme.colors.primary}`;
}};
        border: 2px solid #ff9333;
        border-radius: 0.6em;
        color: ${(props: StyledButtonProps) => {
  if (props.color) return props.color;
  else return props.theme.colors.primary;
}};
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        align-self: center;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1;
        padding: 0.7em 2em;
        font-family: ${(props) => props.theme.text.primaryFont};
        text-decoration: none;
        text-align: center;
        text-transform: uppercase;
        font-weight: 700;
    }

    .button:hover,
    .button:focus {
        color: #fff;
        outline: 0;
    }

    .fade-button-effect {
        border-color: ${(props: StyledButtonProps) => {
  if (props.color) return props.color;
  else return props.theme.colors.primary;
}};
        color: #fff;
        box-shadow: ${(props: StyledButtonProps) => {
  if (props.color) {
    return `0 0 40px 40px ${props.color} inset, 0 0 0 0 ${props.color}`;
  } else {
    return `0 0 40px 40px ${props.theme.colors.primary} inset, 0 0 0 0 ${props.theme.colors.primary}`;
  }
}};
        transition: all 150ms ease-in-out;
    }
    .fade-button-effect:hover {
        box-shadow: ${(props: StyledButtonProps) => {
  if (props.color) {
    return `0 0 10px 0 ${props.color} inset, 0 0 10px 4px ${props.color}`;
  } else {
    return `0 0 10px 0 ${props.theme.colors.primary} inset, 0 0 10px 4px ${props.theme.colors.primary}`;
  }
}};

        color: ${(props: StyledButtonProps) => {
  if (props.noFade) return "white";
  else {
    if (props.color) return props.color;
    else return props.theme.colors.primary;
  }
}};
    }
`;

export default FadeBorderButton;
