import { redirect } from "next/navigation";

const OnboardPage = () => {
  redirect("/app/onboard/create-profile");
};

export default OnboardPage;
