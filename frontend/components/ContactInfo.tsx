import { manrope } from "@/app/fonts";
import { DEFAULT_GENERAL_EMAIL, DEFAULT_REPORT_EMAIL } from "@/lib/enquiry";

type Props = {
  generalEmail?: string | null;
  reportEmail?: string | null;
};

export default function ContactInfo({ generalEmail, reportEmail }: Props) {
  const items = [
    {
      label: "General Enquiries",
      email: generalEmail || DEFAULT_GENERAL_EMAIL,
    },
    { label: "Report Piracy", email: reportEmail || DEFAULT_REPORT_EMAIL },
  ];

  return (
    <dl className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs uppercase tracking-[0.18em] text-[#2A4879]">
            {item.label}
          </dt>
          <dd className="mt-1">
            <a
              href={`mailto:${item.email}`}
              className={`${manrope.className} text-[17px] font-medium text-brand-blue transition-colors hover:text-[#123a85] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue`}
            >
              {item.email}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}
