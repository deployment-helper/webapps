import { LoginAndSignUp } from "@/components/LoginAndSignup";
import Header from "@/components/header/Header";

export const Auth = () => {
  return (
    <>
      <Header title="Slides" type="public" />
      <div className="flex h-96 w-full items-center justify-center">
        <LoginAndSignUp ssoUrl="http://example.com" />
      </div>
    </>
  );
};

export default Auth;
