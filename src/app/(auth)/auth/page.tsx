import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignInPage from "../signin/page";
import SignupPage from "../signup/page";

export default function AuthPage() {
  return (
    <main className="mt-6 flex justify-center items-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <SignInPage />
        </TabsContent>
        <TabsContent value="register">
          <SignupPage />
        </TabsContent>
      </Tabs>
    </main>
  );
}