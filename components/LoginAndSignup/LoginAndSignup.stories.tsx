import { Meta } from "@storybook/react";
import { LoginAndSignUp } from ".";

const meta: Meta = {
  title: "Components/LoginAndSignup",
  component: LoginAndSignUp,
};

export default meta;

export const LoginAndSignupStory = () => {
  return <LoginAndSignUp ssoUrl="https://google.com" />;
};
