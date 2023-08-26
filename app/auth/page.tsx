import { LoginAndSignUp } from "@/components/LoginAndSignup";

export const Auth = () => {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <LoginAndSignUp ssoUrl="http://example.com" />
    </div>
  );
};

export default Auth;
