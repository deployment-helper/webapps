"use client";

import { FC } from "react";
import { LoginAndSignupProps } from "./LoginAndSignup.types";
import { Button, Subtitle1, Title1 } from "@fluentui/react-components";

export const LoginAndSignUp: FC<LoginAndSignupProps> = ({
  ssoUrl,
}: LoginAndSignupProps) => {
  return (
    <div className="items-centern flex h-full w-full justify-center">
      <div className="flex h-full w-1/3 flex-col items-center justify-center gap-10">
        <Title1>Login to Slides</Title1>
        <Subtitle1>
          Log in quickly and securely using your SSO credentials. Click the
          button below to proceed.
        </Subtitle1>
        <Button href={ssoUrl} as="a" appearance="primary" size="large">
          Login/Signup
        </Button>
        <div>
          Privacy Note: Your privacy is of utmost importance to us. By
          proceeding with the Single Sign-On (SSO) login, you agree to our
          Privacy Policy, which outlines how we collect, use, and safeguard your
          personal information. We adhere to stringent data protection standards
          to ensure your data is handled securely and responsibly.
        </div>
      </div>
    </div>
  );
};
