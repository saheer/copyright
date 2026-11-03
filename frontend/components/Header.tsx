import HeaderClient from "@/components/HeaderClient";
import { getServicesMenu } from "@/sanity/lib/getServices";
import { SERVICES_FALLBACK } from "@/lib/services";

// Server wrapper: fetches the services for the dropdown, then hands them to the
// interactive header. Pages keep using <Header /> exactly as before.
export default async function Header() {
  const menu = await getServicesMenu();
  const services =
    Array.isArray(menu) && menu.length > 0 ? menu : SERVICES_FALLBACK;
  return <HeaderClient services={services} />;
}
