import { LoginAndSignUp } from "@/components/LoginAndSignup";
import Header from "@/components/Header/Header";

const Auth = () => {
  const ssoUrl = process.env.LOGIN_SIGNUP_URL;
  return (
    <>
      <Header title="Slides" type="public" />
      <div className="flex h-96 w-full items-center justify-center">
        <LoginAndSignUp ssoUrl={ssoUrl} />
      </div>
    </>
  );
};

export default Auth;
