import PhoneSection from "@/components/console/settings/PhoneSection";
import UserInfo from "@/components/console/settings/UserInfo";

export default async function SettingsPage() {

  return (
    <div>
      <UserInfo />
      <PhoneSection initialPhone={"123456789"} initialVerified={false}/>
    </div>
  );
}
